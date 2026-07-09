// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from '../../schemas/user.schema';
// import { AuditLog, AuditLogSchema } from '../../schemas/audit-log.schema';
// import { TelegramModule } from '../telegram/telegram.module';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: AuditLog.name, schema: AuditLogSchema },
//     ]),
//     TelegramModule,
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
//   exports: [UsersService],
// })
// export class UsersModule {}
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../schemas/user.schema";
import { AuditLog, AuditLogSchema } from "../../schemas/audit-log.schema";
import { TelegramModule } from "../telegram/telegram.module";
import { WeatherModule } from "../weather/weather.module";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    TelegramModule,
    WeatherModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
