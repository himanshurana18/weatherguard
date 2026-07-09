import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WeatherService } from './weather.service';
import { UserDocument } from '../../schemas/user.schema';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  // Admin-only: run the alert check immediately instead of waiting for the 6-hour cron.
  @Post('trigger')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async triggerNow(@CurrentUser() user: UserDocument) {
    await this.weatherService.processWeatherAlerts(user._id.toString());
    return { message: 'Weather check triggered. Alerts (if any) were sent just now.' };
  }

  // Any approved user: see their live weather + whether it would currently trigger an alert.
  @Get('me')
  async getMyWeather(@CurrentUser() user: UserDocument) {
    return this.weatherService.getCurrentWeatherForUser(user._id.toString());
  }
}
