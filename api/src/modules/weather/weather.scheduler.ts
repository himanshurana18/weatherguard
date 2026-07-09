import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from './weather.service';

@Injectable()
export class WeatherScheduler {
  private logger = new Logger(WeatherScheduler.name);

  constructor(private weatherService: WeatherService) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleWeatherAlerts() {
    this.logger.debug('Running weather alert check');
    await this.weatherService.processWeatherAlerts();
  }
}
