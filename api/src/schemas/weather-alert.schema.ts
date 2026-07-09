import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WeatherAlert {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['rain', 'storm', 'heat', 'cold', 'wind'] })
  type: 'rain' | 'storm' | 'heat' | 'cold' | 'wind';

  @Prop({ required: true })
  message: string;

  @Prop({
    type: {
      temp: Number,
      condition: String,
      humidity: Number,
      windSpeed: Number,
    },
    required: true,
  })
  weatherData: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };

  @Prop({ required: true, default: () => new Date() })
  sentAt: Date;

  @Prop({ required: true, enum: ['sent', 'failed'], default: 'sent' })
  status: 'sent' | 'failed';
}

export const WeatherAlertSchema = SchemaFactory.createForClass(WeatherAlert);
export type WeatherAlertDocument = WeatherAlert & Document;
