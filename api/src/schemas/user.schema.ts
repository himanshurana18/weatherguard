import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ required: true, enum: ['google', 'github'] })
  provider: 'google' | 'github';

  @Prop({ required: true, unique: true })
  providerId: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Prop({ required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ type: String, default: null })
  telegramChatId: string | null;

  @Prop({ type: String, default: null })
  telegramUsername: string | null;

  @Prop({
    type: {
      city: String,
      lat: Number,
      lon: Number,
    },
    default: null,
  })
  location: { city: string; lat: number; lon: number } | null;

  @Prop({ required: true, default: () => new Date() })
  requestedAt: Date;

  @Prop({ type: Date, default: null })
  approvedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  approvedBy: Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
