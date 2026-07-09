import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true, enum: ['USER_APPROVED', 'USER_REJECTED', 'ALERT_SENT'] })
  action: 'USER_APPROVED' | 'USER_REJECTED' | 'ALERT_SENT';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  performedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  targetUser: Types.ObjectId | null;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
export type AuditLogDocument = AuditLog & Document;
