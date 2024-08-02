import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Service } from './service'
import { SensorController } from './controller';
import { Gateway } from './gateway';
import { Sensor, SensorSchema } from './db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensor.name, schema: SensorSchema }]),
  ],
  controllers: [SensorController],
  providers: [Service, Gateway],
})
export class SensorModule {}
