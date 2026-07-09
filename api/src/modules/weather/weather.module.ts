import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherAlert, WeatherAlertSchema } from '../../schemas/weather-alert.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuditLog, AuditLogSchema } from '../../schemas/audit-log.schema';
import { TelegramModule } from '../telegram/telegram.module';
import { WeatherService } from './weather.service';
import { WeatherScheduler } from './weather.scheduler';
import { WeatherController } from './weather.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherAlert.name, schema: WeatherAlertSchema },
      { name: User.name, schema: UserSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    TelegramModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherScheduler],
  exports: [WeatherService],
})
export class WeatherModule {}
