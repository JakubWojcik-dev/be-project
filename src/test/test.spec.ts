import { Test, TestingModule } from '@nestjs/testing';
import { Gateway } from '../sensor/gateway';
import { Service } from '../sensor/service';
import { Sensor } from '../sensor/db/schema';
import { NotFoundException } from '@nestjs/common';

const mockSensor = (id = '123f' ,temperature = 25, humidity = 60) => ({
  id,
  temperature,
  humidity,
});

describe('Gateway', () => {
  let gateway: Gateway;
  let service: Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Gateway,
        {
          provide: Service,
          useValue: {
            createData: jest.fn().mockResolvedValue(mockSensor()),
            getAllData: jest.fn().mockResolvedValue([mockSensor()]),
            getDataById: jest.fn().mockResolvedValue(mockSensor()),
            updateData: jest.fn().mockResolvedValue(mockSensor()),
            deleteData: jest.fn().mockResolvedValue(mockSensor()),
          },
        },
      ],
    }).compile();

    gateway = module.get<Gateway>(Gateway);
    service = module.get<Service>(Service);
  });

  it('Gateway defined', () => {
    expect(gateway).toBeDefined();
  });

  it('Service defined', () => {
    expect(service).toBeDefined();
  });

  it('Create valid data', async () => {
    const data = {id: '123f',  temperature: 25, humidity: 60 } as Sensor;
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleMessage(data);

    expect(service.createData).toHaveBeenCalledWith(data.temperature, data.humidity);
    expect(server.emit).toHaveBeenCalledWith('dataCreated', mockSensor());
  });

  it('Invalid create data error check (data validation)', async () => {
    const data: any = { temperature: 'invalid', humidity: 60 };
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleMessage(data);
    jest.spyOn(service, 'createData').mockImplementationOnce(() => {
     
      throw new NotFoundException(`Data with ID  not found`);
    });

    await gateway.handleMessage(data);

    expect(server.emit).toHaveBeenCalledWith('error', `Error Data format`);
  });
   

  it('Get all data from database', async () => {
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleGetAllData();

    expect(service.getAllData).toHaveBeenCalled();
    expect(server.emit).toHaveBeenCalledWith('allData', [mockSensor()]);
  });

  it('Get data by ID', async () => {
    const id = '123f';
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleGetDataById(id);

    expect(service.getDataById).toHaveBeenCalledWith(id);
    expect(server.emit).toHaveBeenCalledWith('dataById', mockSensor());
  });

  it('Get Data by invalid ID error check (data validation)', async () => {
    const id = 'testId';
    const server = { emit: jest.fn() };
    (gateway as any).server = server;
    jest.spyOn(service, 'getDataById').mockImplementationOnce(() => {
      throw new NotFoundException(`Data with ID ${id} not found`);
    });

    await gateway.handleGetDataById(id);

    expect(server.emit).toHaveBeenCalledWith('error', `Data with ID ${id} not found`);
  });

  it('Update data', async () => {
    const data = { id: '123f', temperature: 26, humidity: 65 };
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleUpdateData(data);

    expect(service.updateData).toHaveBeenCalledWith(data.id, data.temperature, data.humidity);
    expect(server.emit).toHaveBeenCalledWith('dataUpdated', mockSensor());
  });

  it('Update with invalid data error check (data validation)', async () => {
    const data  = { id: 'Testid', temperature: 'invalid', humidity: 60 } as any;
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleUpdateData(data);
    jest.spyOn(service,'updateData').mockImplementationOnce(() => {
      throw new NotFoundException(`Data with ID ${data.id} not found`);
    });
    expect(service.updateData).toHaveBeenCalledWith(data.id, data.temperature, data.humidity);
    expect(service.updateData).toThrowErrorMatchingSnapshot(`Data with ID ${data.id} not found`)
  });

  it('Delete data by ID', async () => {
    const id = '123f';
    const server = { emit: jest.fn() };
    (gateway as any).server = server;

    await gateway.handleDeleteData(id);

    expect(service.deleteData).toHaveBeenCalledWith(id);
    expect(server.emit).toHaveBeenCalledWith('dataDeleted', mockSensor());
  });

  it('Delete data by invalid ID error check (data validation)', async () => {
    const id = 'TestId';
    const server = { emit: jest.fn() };
    (gateway as any).server = server;
    await gateway.handleDeleteData(id)

    jest.spyOn(service,'deleteData').mockImplementationOnce(() => {
      throw new NotFoundException(`Data with ID ${id} not found`);
    });

    expect(service.deleteData).toHaveBeenCalledWith(id);
    expect(service.deleteData).toThrowErrorMatchingSnapshot(`Data with ID ${id} not found`)
   
  });
});
