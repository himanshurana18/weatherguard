import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>) {}

  async log(
    action: 'USER_APPROVED' | 'USER_REJECTED' | 'ALERT_SENT',
    performedBy: string,
    targetUser?: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLogDocument> {
    return this.auditModel.create({
      action,
      performedBy: new Types.ObjectId(performedBy),
      targetUser: targetUser ? new Types.ObjectId(targetUser) : null,
      metadata,
    });
  }

  async getLogs(skip: number = 0, limit: number = 50): Promise<AuditLogDocument[]> {
    return this.auditModel.find().skip(skip).limit(limit).sort({ timestamp: -1 });
  }

  async getLogsByUser(userId: string, limit: number = 50): Promise<AuditLogDocument[]> {
    return this.auditModel
      .find({ $or: [{ performedBy: userId }, { targetUser: userId }] })
      .limit(limit)
      .sort({ timestamp: -1 });
  }
}
