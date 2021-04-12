import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule // this means anything authmodule exports, this module imports, because we want to apply guard on task routes
  
  ], // to make task.repository.ts available anywhere in tasks module via dependency injection
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
