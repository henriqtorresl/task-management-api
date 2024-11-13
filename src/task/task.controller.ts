import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FindAllQueryParams, TaskDto } from './task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskDto) {
    this.taskService.create(task);
  }

  @Get('/:id')
  findById(@Param('id') id: string): TaskDto {
    return this.taskService.findById(id);
  }

  @Get()
  findAll(@Query() queryParams: FindAllQueryParams): TaskDto[] {
    return this.taskService.findAll(queryParams);
  }

  @Put()
  update(@Body() task: TaskDto) {
    this.taskService.update(task);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    this.taskService.remove(id);
  }
}
