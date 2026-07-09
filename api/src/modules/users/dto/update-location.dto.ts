import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateLocationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  city: string;
}
