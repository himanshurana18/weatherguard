import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot | null = null;
  private logger = new Logger(TelegramService.name);

  constructor(configService: ConfigService) {
    const token = configService.get<string>('TELEGRAM_BOT_TOKEN') as string;

    if (!token || token.trim() === '' || token === 'your-telegram-bot-token') {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN is missing or still set to the placeholder value. ' +
          'Telegram features are disabled until a real bot token from @BotFather is set in .env',
      );
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: true });
      this.bot.on('polling_error', (err: Error) => {
        this.logger.error(`Telegram polling error: ${err.message}`);
      });
      this.setupBotListeners();
      this.logger.log('Telegram bot polling started');
    } catch (err) {
      this.logger.error('Failed to initialize Telegram bot, continuing without it', err as Error);
      this.bot = null;
    }
  }

  private setupBotListeners() {
    if (!this.bot) return;
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from?.username || 'User';
      const message =
        `Welcome to WeatherGuard Bot!\n\n` +
        `Your Chat ID: \`${chatId}\`\n\n` +
        `To link your account:\n` +
        `1. Visit the admin panel\n` +
        `2. Go to account settings\n` +
        `3. Enter your Chat ID: ${chatId}\n` +
        `4. Enter your username: @${username}\n\n` +
        `You'll receive weather alerts here!`;
      this.bot!.sendMessage(chatId, message);
    });
  }

  async sendApprovalMessage(chatId: string): Promise<void> {
    if (!this.bot) {
      this.logger.warn(`Skipped approval message to ${chatId}: Telegram bot is not configured`);
      return;
    }
    try {
      const message =
        `✅ Your account has been approved!\n\n` +
        `You will now receive weather alerts based on your location.\n` +
        `Make sure your location is set in the admin panel.`;
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error(`Failed to send approval message to ${chatId}:`, error);
    }
  }

  async sendWeatherAlert(chatId: string, alertData: any): Promise<void> {
    if (!this.bot) {
      this.logger.warn(`Skipped weather alert to ${chatId}: Telegram bot is not configured`);
      return;
    }
    try {
      const message =
        `⚠️ Weather Alert!\n\n` +
        `Type: ${alertData.type}\n` +
        `Temperature: ${alertData.temp}°C\n` +
        `Condition: ${alertData.condition}\n` +
        `Humidity: ${alertData.humidity}%\n` +
        `Wind Speed: ${alertData.windSpeed} km/h\n\n` +
        `${alertData.message}`;
      await this.bot.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error(`Failed to send weather alert to ${chatId}:`, error);
    }
  }
}
