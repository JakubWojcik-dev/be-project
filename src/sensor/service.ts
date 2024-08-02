import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensor, SensorDocument } from './db/schema';

@Injectable()
export class Service {
  constructor(@InjectModel(Sensor.name) private sensorModel: Model<SensorDocument>) {}

  // Insert new data into DB
  async createData(temperature: number, humidity: number): Promise<Sensor> {
    const newSensor = new this.sensorModel({ temperature, humidity });
    return newSensor.save();
  }

  // Get all data from DB
  async getAllData(): Promise<Sensor[]> {
    return this.sensorModel.find();
  }

  // Get data by ID. Function return single item. When item is not founded in db, function throws exception.
  async getDataById(id: string): Promise<Sensor> {
    const sensor = await this.sensorModel.findById(id);
    if (!sensor) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    return sensor;
  }

  // Update item based on ID of existing item. When succeesed returns item with new values. Function also handle request with wrong ID.
  async updateData(id: string, temperature: number, humidity: number): Promise<Sensor> {
    const updatedSensor = await this.sensorModel.findByIdAndUpdate(
      id,
      { temperature, humidity }
    );
    if (!updatedSensor) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    return updatedSensor;
  }

  // Delete item based on ID of existing item. When succeesed returns item values. Function also handle request with wrong ID.
  async deleteData(id: string): Promise<Sensor> {
    const deletedSensor = await this.sensorModel.findByIdAndDelete(id);
    if (!deletedSensor) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    return deletedSensor;
  }
}
