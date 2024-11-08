import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllQueryParams, TaskDto } from './task.dto';

@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  constructor() {}

  create(task: TaskDto): void {
    this.tasks.push(task);
  }

  findById(id: string): TaskDto {
    const foundTask: TaskDto[] = this.tasks.filter((t) => t.id === id);

    // Se o filter não encontrar ninguém o tamanho do array será 0...
    if (foundTask.length) {
      return foundTask[0];
    }

    // Duas formas de lançar essa exceção:
    // throw new NotFoundException(`Task with id ${id} not exists.`);
    throw new HttpException(
      `Task with id ${id} not exists.`,
      HttpStatus.NOT_FOUND,
    );
  }

  findAll(params: FindAllQueryParams): TaskDto[] {
    return this.tasks.filter((task) => {
      let match: boolean = true;

      if (params.status != undefined && !params.status.includes(task.status)) {
        match = false;
      }

      if (params.title != undefined && !params.title.includes(task.title)) {
        match = false;
      }

      return match;
    });
  }

  update(task: TaskDto): void {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);

    // Se não encontrar, o findIndex retorna -1
    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;
      return;
    }

    throw new HttpException(
      `Task with id ${task.id} not exists.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    throw new HttpException(
      `Task with id ${id} not exists.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
