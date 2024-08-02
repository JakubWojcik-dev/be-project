import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Service } from './service';
import { Sensor } from './db/schema';


//In this file each socket event is handled and controlled
@Controller('sensor')
export class SensorController {
  constructor(private readonly service: Service) {}

  
  @Post()
  async create(@Body() create: { temperature: number, humidity: number }): Promise<Sensor> {
    const { temperature, humidity } = create;
    
    return this.service.createData(temperature, humidity);
  }

  @Get()
  async findAll(): Promise<Sensor[]> {
    return this.service.getAllData();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Sensor> {
    return this.service.getDataById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() update: { temperature: number, humidity: number }): Promise<Sensor> {
    const { temperature, humidity } = update;
    return this.service.updateData(id, temperature, humidity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Sensor> {
    return this.service.deleteData(id);
  }
}
export { Controller };

