import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-fitler.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    /**
     * if task id isn't owned by that user, we return 404 and not 403, because we don't want to expose any information that the task exists or not
     * if someone is trying to attack, I don't want to expose that, it's private info and common practice.
     * applied by github, if you try to access private repo that you don't have access to , github gives you 404 and not 403
     */
    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id }});
        if (!found) {
            throw new NotFoundException(`Task with "${id}" Not found`);
        }
        return found;
    }


    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user)
    }


    async deleteTask(id: number, user: User): Promise<void> {

        // NOTE: methods: Repository class has 2 methods to remove a task: "delete" and "remove", the difference between them:
        // delete: we can simply pass the id and based on the result, I can check if any rows are affected. if result is 0, so we know that row we want to delete
        // doesn't exist.
        // remove: first have to retrieve the task that we want to delete, then once we have the task object we pass it as argument to remove method, remove(entity)
        // our CHOICE: we want to call database as little as I can, DB operations can be quite expensive performancewise. we use delete.
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with "${id}" Not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save()
        return task
    }
    
}
