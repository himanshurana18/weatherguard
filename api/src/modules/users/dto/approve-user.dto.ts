import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
