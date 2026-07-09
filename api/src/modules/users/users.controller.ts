// import { Controller, Get, Patch, UseGuards, Query, Param, Body, ForbiddenException } from '@nestjs/common';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { CurrentUser } from '../../common/decorators/current-user.decorator';
// import { UsersService } from './users.service';
// import { ApproveUserDto } from './dto/approve-user.dto';
// import { RejectUserDto } from './dto/reject-user.dto';
// import { LinkTelegramDto } from './dto/link-telegram.dto';
// import { UserDocument } from '../../schemas/user.schema';

// @Controller('users')
// @UseGuards(JwtAuthGuard)
// export class UsersController {
//   constructor(private usersService: UsersService) {}

//   @Get()
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async getAllUsers(@Query('status') status?: 'pending' | 'approved' | 'rejected') {
//     return this.usersService.findAll(status);
//   }

//   @Get('stats')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async getStats() {
//     return this.usersService.getStats();
//   }

//   @Patch(':id/approve')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async approveUser(@Param('id') userId: string, @CurrentUser() user: UserDocument) {
//     return this.usersService.approveUser(userId, user);
//   }

//   @Patch(':id/reject')
//   @UseGuards(RolesGuard)
//   @Roles('admin')
//   async rejectUser(
//     @Param('id') userId: string,
//     @Body() dto: RejectUserDto,
//     @CurrentUser() user: UserDocument,
//   ) {
//     return this.usersService.rejectUser(userId, user, dto.reason);
//   }

//   @Patch(':id/telegram')
//   async linkTelegram(
//     @Param('id') userId: string,
//     @Body() dto: LinkTelegramDto,
//     @CurrentUser() user: UserDocument,
//   ) {
//     if (user._id.toString() !== userId) {
//       throw new ForbiddenException('Can only update own telegram');
//     }
//     return this.usersService.linkTelegram(userId, dto.telegramChatId, dto.telegramUsername);
//   }
// }
import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Query,
  Param,
  Body,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UsersService } from "./users.service";
import { ApproveUserDto } from "./dto/approve-user.dto";
import { RejectUserDto } from "./dto/reject-user.dto";
import { LinkTelegramDto } from "./dto/link-telegram.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { UserDocument } from "../../schemas/user.schema";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  async getAllUsers(
    @Query("status") status?: "pending" | "approved" | "rejected",
  ) {
    return this.usersService.findAll(status);
  }

  @Get("stats")
  @UseGuards(RolesGuard)
  @Roles("admin")
  async getStats() {
    return this.usersService.getStats();
  }

  @Patch(":id/approve")
  @UseGuards(RolesGuard)
  @Roles("admin")
  async approveUser(
    @Param("id") userId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.usersService.approveUser(userId, user);
  }

  @Patch(":id/reject")
  @UseGuards(RolesGuard)
  @Roles("admin")
  async rejectUser(
    @Param("id") userId: string,
    @Body() dto: RejectUserDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.usersService.rejectUser(userId, user, dto.reason);
  }

  @Patch(":id/telegram")
  async linkTelegram(
    @Param("id") userId: string,
    @Body() dto: LinkTelegramDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (user._id.toString() !== userId) {
      throw new ForbiddenException("Can only update own telegram");
    }
    return this.usersService.linkTelegram(
      userId,
      dto.telegramChatId,
      dto.telegramUsername,
    );
  }

  @Patch(":id/location")
  async updateLocation(
    @Param("id") userId: string,
    @Body() dto: UpdateLocationDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (user._id.toString() !== userId) {
      throw new ForbiddenException("Can only update own location");
    }
    return this.usersService.updateLocation(userId, dto.city);
  }
}
