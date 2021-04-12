import { EntityRepository, Repository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-fitler.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

// Reference for Repository: http://typeorm.delightful.studio/classes/_repository_repository_.repository.html
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        // Reference for query builder https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md
        const query = this.createQueryBuilder('task');  // task is the name of the Repository table

        query.where({ userId: user.id }) //  another way to write: query.where('task.userId = :userId', { userId: user.id })
        
        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`})
        }

        try {
            const tasks = await query.getMany();
            return tasks; 
        } catch (err) {
            this.logger.error(`Failed to get task for user "${ user.username }". Filters: ${ JSON.stringify(filterDto) }`, err.stack);
            throw new InternalServerErrorException()
        }
       

    }
    

    // creating task is a db operation, so it's logically belongs here.
    // We see that the base "Repository" class that we are extending has many builtin db methods to do db operations, but also
    // allows to write manual methods as we did here
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
           await task.save(); 
        } catch (err) {
            this.logger.error(`Failed to create a task for user "${ user.username }". Data: ${ JSON.stringify(createTaskDto) }`, err.stack)
        }
        
        delete task.user;   // if we didn't delete user, the entire user object will be returned, which is not logical and insecure.
                            // don't mind, this will not remove user entity from database, because it has already been saved
        return task;
    }

}

/**
 * Q: Why would you create a Repository to handle database transactions, rather than handle them directly in your service?
 * A: Creating a repository allows for a place to contain our database-interaction related logic. This way, we can keep our services cleaner. 
 * Service will still be able to handle business logic, but database-related logic will be handled by the repository.
 */