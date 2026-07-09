import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { WeatherModule } from './modules/weather/weather.module';
import { AuditModule } from './modules/audit/audit.module';

const mongoLogger = new Logger('MongoDB');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        OAUTH_CALLBACK_URL_BASE: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
        OPENWEATHER_API_KEY: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI') as string;
        mongoLogger.log(`Connecting to MongoDB at ${uri}`);
        return {
          uri,
          serverSelectionTimeoutMS: 8000,
          connectionFactory: (connection) => {
            connection.on('connected', () => mongoLogger.log('MongoDB connected'));
            connection.on('error', (err: Error) =>
              mongoLogger.error(`MongoDB connection error: ${err.message}`),
            );
            connection.on('disconnected', () => mongoLogger.warn('MongoDB disconnected'));
            return connection;
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    TelegramModule,
    WeatherModule,
    AuditModule,
  ],
})
export class AppModule {}
