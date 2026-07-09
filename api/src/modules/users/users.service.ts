// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { User, UserDocument } from '../../schemas/user.schema';
// import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';
// import { TelegramService } from '../telegram/telegram.service';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
//     private telegramService: TelegramService,
//   ) {}

//   async findAll(status?: 'pending' | 'approved' | 'rejected'): Promise<UserDocument[]> {
//     const query: { status?: 'pending' | 'approved' | 'rejected' } = status ? { status } : {};
//     return this.userModel.find(query).sort({ requestedAt: -1 });
//   }

//   async findById(id: string): Promise<UserDocument> {
//     const user = await this.userModel.findById(id);
//     if (!user) throw new NotFoundException('User not found');
//     return user;
//   }

//   async getStats(): Promise<{
//     total: number;
//     pending: number;
//     approved: number;
//     rejected: number;
//   }> {
//     const [total, pending, approved, rejected] = await Promise.all([
//       this.userModel.countDocuments(),
//       this.userModel.countDocuments({ status: 'pending' }),
//       this.userModel.countDocuments({ status: 'approved' }),
//       this.userModel.countDocuments({ status: 'rejected' }),
//     ]);

//     return { total, pending, approved, rejected };
//   }

//   async approveUser(userId: string, performedBy: UserDocument): Promise<UserDocument> {
//     const user = await this.findById(userId);

//     user.status = 'approved';
//     user.approvedAt = new Date();
//     user.approvedBy = new Types.ObjectId(performedBy._id);
//     await user.save();

//     await this.auditModel.create({
//       action: 'USER_APPROVED',
//       performedBy: performedBy._id,
//       targetUser: new Types.ObjectId(userId),
//       metadata: { email: user.email },
//     });

//     if (user.telegramChatId) {
//       await this.telegramService.sendApprovalMessage(user.telegramChatId);
//     }

//     return user;
//   }

//   async rejectUser(userId: string, performedBy: UserDocument, reason?: string): Promise<UserDocument> {
//     const user = await this.findById(userId);

//     user.status = 'rejected';
//     await user.save();

//     await this.auditModel.create({
//       action: 'USER_REJECTED',
//       performedBy: performedBy._id,
//       targetUser: new Types.ObjectId(userId),
//       metadata: { email: user.email, reason },
//     });

//     return user;
//   }

//   async linkTelegram(userId: string, chatId: string, username?: string): Promise<UserDocument> {
//     const user = await this.findById(userId);

//     user.telegramChatId = chatId;
//     user.telegramUsername = username ?? null;
//     await user.save();

//     return user;
//   }
// }
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "../../schemas/user.schema";
import { AuditLog, AuditLogDocument } from "../../schemas/audit-log.schema";
import { TelegramService } from "../telegram/telegram.service";
import { WeatherService } from "../weather/weather.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
    private telegramService: TelegramService,
    private weatherService: WeatherService,
  ) {}

  async findAll(
    status?: "pending" | "approved" | "rejected",
  ): Promise<UserDocument[]> {
    const query: { status?: "pending" | "approved" | "rejected" } = status
      ? { status }
      : {};
    return this.userModel.find(query).sort({ requestedAt: -1 });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const [total, pending, approved, rejected] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ status: "pending" }),
      this.userModel.countDocuments({ status: "approved" }),
      this.userModel.countDocuments({ status: "rejected" }),
    ]);

    return { total, pending, approved, rejected };
  }

  async approveUser(
    userId: string,
    performedBy: UserDocument,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);

    user.status = "approved";
    user.approvedAt = new Date();
    user.approvedBy = new Types.ObjectId(performedBy._id);
    await user.save();

    await this.auditModel.create({
      action: "USER_APPROVED",
      performedBy: performedBy._id,
      targetUser: new Types.ObjectId(userId),
      metadata: { email: user.email },
    });

    if (user.telegramChatId) {
      await this.telegramService.sendApprovalMessage(user.telegramChatId);
    }

    return user;
  }

  async rejectUser(
    userId: string,
    performedBy: UserDocument,
    reason?: string,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);

    user.status = "rejected";
    await user.save();

    await this.auditModel.create({
      action: "USER_REJECTED",
      performedBy: performedBy._id,
      targetUser: new Types.ObjectId(userId),
      metadata: { email: user.email, reason },
    });

    return user;
  }

  async linkTelegram(
    userId: string,
    chatId: string,
    username?: string,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);

    user.telegramChatId = chatId;
    user.telegramUsername = username ?? null;
    await user.save();

    return user;
  }

  async updateLocation(userId: string, city: string): Promise<UserDocument> {
    const user = await this.findById(userId);

    const geo = await this.weatherService.geocodeCity(city);
    if (!geo) {
      throw new BadRequestException(
        `Could not find location for "${city}". Try a more specific name, e.g. "Delhi,IN".`,
      );
    }

    user.location = { city: geo.name, lat: geo.lat, lon: geo.lon };
    await user.save();

    return user;
  }
}
