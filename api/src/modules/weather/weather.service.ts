import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { User, UserDocument } from '../../schemas/user.schema';
import { WeatherAlert, WeatherAlertDocument } from '../../schemas/weather-alert.schema';
import { TelegramService } from '../telegram/telegram.service';
import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';

@Injectable()
export class WeatherService {
  private logger = new Logger(WeatherService.name);
  private apiKey: string;

  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(WeatherAlert.name) private alertModel: Model<WeatherAlertDocument>,
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
    private telegramService: TelegramService,
  ) {
    this.apiKey = configService.get<string>('OPENWEATHER_API_KEY') as string;
  }

  async geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city,
      )}&limit=1&appid=${this.apiKey}`;
      const response = await axios.get(url);
      const results = response.data;

      if (!results || results.length === 0) {
        return null;
      }

      const { lat, lon, name, state, country } = results[0];
      const label = [name, state, country].filter(Boolean).join(', ');
      return { lat, lon, name: label };
    } catch (error) {
      this.logger.error(`Failed to geocode city "${city}":`, error);
      return null;
    }
  }

  async getWeatherForCity(city: string, lat: number, lon: number): Promise<any> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${city}:`, error);
      return null;
    }
  }

  checkAlertConditions(weatherData: any): { type: string; message: string } | null {
    if (!weatherData) return null;

    const temp = weatherData.main?.temp;
    const condition = weatherData.weather?.[0]?.main;
    const humidity = weatherData.main?.humidity;
    const windSpeed = weatherData.wind?.speed * 3.6;

    if (windSpeed > 50) {
      return {
        type: 'wind',
        message: `High wind warning! Wind speed: ${windSpeed.toFixed(1)} km/h`,
      };
    }

    if (temp > 40) {
      return {
        type: 'heat',
        message: `Extreme heat warning! Temperature: ${temp}°C`,
      };
    }

    if (temp < 5) {
      return {
        type: 'cold',
        message: `Cold warning! Temperature: ${temp}°C`,
      };
    }

    if (condition === 'Rain') {
      return {
        type: 'rain',
        message: `Rain alert! Humidity: ${humidity}%`,
      };
    }

    if (condition === 'Thunderstorm') {
      return {
        type: 'storm',
        message: `Thunderstorm warning!`,
      };
    }

    return null;
  }

  async getCurrentWeatherForUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.location) {
      return { error: 'No location set yet. Go to Settings and set your city first.' };
    }

    const weatherData = await this.getWeatherForCity(
      user.location.city,
      user.location.lat,
      user.location.lon,
    );

    if (!weatherData) {
      return { error: 'Could not fetch live weather right now. Check OPENWEATHER_API_KEY.' };
    }

    const alert = this.checkAlertConditions(weatherData);
    const windSpeedKmh = weatherData.wind?.speed ? weatherData.wind.speed * 3.6 : null;

    return {
      city: user.location.city,
      temp: weatherData.main?.temp,
      condition: weatherData.weather?.[0]?.main,
      description: weatherData.weather?.[0]?.description,
      humidity: weatherData.main?.humidity,
      windSpeedKmh,
      wouldTriggerAlert: !!alert,
      alertReason: alert?.message ?? null,
    };
  }

  async processWeatherAlerts(adminId?: string): Promise<void> {
    try {
      const users = await this.userModel.find({
        status: 'approved',
        telegramChatId: { $exists: true, $ne: null },
        location: { $exists: true, $ne: null },
      });

      for (const user of users) {
        if (!user.location || !user.telegramChatId) continue;
        const location = user.location;
        const telegramChatId = user.telegramChatId;

        const weatherData = await this.getWeatherForCity(
          location.city,
          location.lat,
          location.lon,
        );

        if (!weatherData) continue;

        const alert = this.checkAlertConditions(weatherData);

        if (alert) {
          const weatherAlert = await this.alertModel.create({
            userId: new Types.ObjectId(user._id as any),
            type: alert.type as 'rain' | 'storm' | 'heat' | 'cold' | 'wind',
            message: alert.message,
            weatherData: {
              temp: weatherData.main?.temp,
              condition: weatherData.weather?.[0]?.main,
              humidity: weatherData.main?.humidity,
              windSpeed: weatherData.wind?.speed * 3.6,
            },
            status: 'sent',
          });

          try {
            await this.telegramService.sendWeatherAlert(telegramChatId, {
              type: alert.type,
              temp: weatherData.main?.temp,
              condition: weatherData.weather?.[0]?.main,
              humidity: weatherData.main?.humidity,
              windSpeed: weatherData.wind?.speed * 3.6,
              message: alert.message,
            });

            if (adminId) {
              await this.auditModel.create({
                action: 'ALERT_SENT',
                performedBy: new Types.ObjectId(adminId),
                targetUser: new Types.ObjectId(user._id as any),
                metadata: { alertType: alert.type, city: location.city },
              });
            }
          } catch (error) {
            this.logger.error(`Failed to send alert to user ${user._id}:`, error);
            weatherAlert.status = 'failed';
            await weatherAlert.save();
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing weather alerts:', error);
    }
  }
}
