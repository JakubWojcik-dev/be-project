import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Service } from './service';
import { Sensor } from './db/schema';
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway()
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly service: Service) {}

  afterInit(server: Server) {
    console.log('Start server');
  }

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('insertData')
  async handleMessage(@MessageBody() data: Sensor) {
    
    try {
      await this.service.createData(data.temperature, data.humidity);
      this.server.emit('dataCreated', data);
    } catch (error) {
      this.server.emit('error', 'Error Data format');
    }
   
  }

// Each SubscribeMessage method is responsible for dealing with each socket event.

 @SubscribeMessage('getAllData')
 async handleGetAllData() {
  console.log('getAllData');
   const sensors = await this.service.getAllData();
   this.server.emit('allData', sensors);
 }

 
 @SubscribeMessage('getDataById')
 async handleGetDataById(@MessageBody() id: string) {
  console.log('getDataById');
   try {
     const sensor = await this.service.getDataById(id);
     this.server.emit('dataById', sensor);
   } catch (error) {
     if (error instanceof NotFoundException) {
       this.server.emit('error', `Data with ID ${id} not found`);
     } else {
       this.server.emit('error', 'An error occurred');
     }
   }
 }


 @SubscribeMessage('updateData')
 async handleUpdateData(@MessageBody() data: { id: string; temperature: number; humidity: number }){
  console.log('updateData');
  
   try {
     const updated = await this.service.updateData(data.id, data.temperature, data.humidity);
     this.server.emit('dataUpdated', updated);
   } catch (error) {
     if (error instanceof NotFoundException) {
       this.server.emit('error', ` data with ID ${data.id} not found`);
     } else {
       this.server.emit('error', 'Error data format');
     }
   }
 }


 @SubscribeMessage('deleteData')
 async handleDeleteData(@MessageBody() id: string) {

   try {
     const deleted = await this.service.deleteData(id);
     this.server.emit('dataDeleted', deleted);
   } catch (error) {
     if (error instanceof NotFoundException) {
       this.server.emit('error', `Data with ID ${id} not found`);
     } else {
       this.server.emit('error', 'An error occurred');
     }
   }
 }
}
