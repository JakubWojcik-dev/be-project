import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNumber, IsDate, IsString } from 'class-validator';
export type SensorDocument = Sensor & Document;

//Sensor schema with Props. Class-validator methods are used for data validation.
@Schema()
export class Sensor {
  @Prop({ required:false })
  @IsString()
  id: string;
  @Prop({ required: true })
  @IsNumber()
  temperature: number;

  @Prop({ required: true })
  @IsNumber()
  humidity: number;

  @Prop({ default: Date.now })
  @IsDate()
  createdAt?: Date;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);
