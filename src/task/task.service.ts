import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllQueryParams, TaskDto, TaskStatusEnum } from './task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {}

  async create(task: TaskDto): Promise<TaskDto> {
    const taskToSave: TaskEntity = {
      status: TaskStatusEnum.TO_DO,
      description: task.description,
      expirationDate: task.expirationDate,
      title: task.title,
    };
    const newTask = await this.repository.save(taskToSave);
    return this.mapEntityToDto(newTask);
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.repository.findOne({ where: { id: id } });

    if (!foundTask) {
      // Duas formas de lançar essa exceção:
      // throw new NotFoundException(`Task with id ${id} not exists.`);
      throw new HttpException(
        `Task with id ${id} not exists.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.mapEntityToDto(foundTask);
  }

  async findAll(params: FindAllQueryParams): Promise<TaskDto[]> {
    const searchParams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchParams.status = Like(`%${params.status}%`);
    }

    const tasksFound = await this.repository.find({
      where: searchParams,
    });
    return tasksFound.map(this.mapEntityToDto);
  }

  async update(id: string, task: TaskDto): Promise<void> {
    const foundTask = await this.repository.findOne({ where: { id: id } });

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${task.id} not exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.repository.update(id, this.mapDtoToEntity(task));
  }

  async remove(id: string) {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `Task with id ${id} not exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapEntityToDto(entity: TaskEntity): TaskDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      expirationDate: entity.expirationDate,
    };
  }

  private mapDtoToEntity(dto: TaskDto): Partial<TaskEntity> {
    return {
      title: dto.title,
      description: dto.description,
      status: dto.status,
      expirationDate: dto.expirationDate,
    };
  }
}
