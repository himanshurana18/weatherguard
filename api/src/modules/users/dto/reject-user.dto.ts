import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RejectUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
