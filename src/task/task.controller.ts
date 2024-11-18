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
import { FindAllQueryParams, TaskDto, TaskRouteParameters } from './task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() task: TaskDto) {
    return await this.taskService.create(task);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<TaskDto> {
    return await this.taskService.findById(id);
  }

  @Get()
  async findAll(@Query() queryParams: FindAllQueryParams): Promise<TaskDto[]> {
    return await this.taskService.findAll(queryParams);
  }

  @Put('/:id')
  async update(@Param() params: TaskRouteParameters, @Body() task: TaskDto) {
    return await this.taskService.update(params.id, task);
  }

  @Delete('/:id')
  async remove(@Param() params: TaskRouteParameters) {
    return await this.taskService.remove(params.id);
  }
}
