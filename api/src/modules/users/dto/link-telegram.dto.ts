import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LinkTelegramDto {
  @IsNotEmpty()
  @IsString()
  telegramChatId: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;
}
