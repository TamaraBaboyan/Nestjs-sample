import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-fitler.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';


const mockUser = { id: 12, username: 'Test' };

/**
 * we see in tasks service the only external dependency we interact with is tasks repository. Here in unit tests we don't want to interact with real database and do
 * DB operations, so we mock the tasks repository. we set a factory function that simply returns an object
 */
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(), // we call a mock: SPY!! bcz mock let us to spy the method
    delete: jest.fn()
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {  // before every test I want to reinitialize my service and reinitialze my repository, bcz I want to each testcase to run independently
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }     // used "useFactory" bcz I want to create it for each test over and over again
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {

            // when setting mock function above: jest.fn, we return a new object that contains other function
            taskRepository.getTasks.mockResolvedValue('SomeValue')

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            
             // getTasks takes two params: filterDto and user, so we mock it
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: "Some search query"}
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled(); // Here we are testing that repositoryes method have been called, not testing the result

            // Let's make sure that that getTasks method return taskrepos.getTasks. So we modified our mock repository mock function a little bit
            expect(result).toEqual('SomeValue');
        });

    })

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retreive and return the task', async () => {
            const mockTask = { title: 'Test Task', description: 'Test Desc' }
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            // another thing we can do, we can validate findOne method to be called with the relevant arguments
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            })

            // in the future if we changes the actual findOne call in tasksService to: this.taskRepository.findOne({ where: { id }}); the task will fail
            // this is great
            
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException); // we can leave .toThrow() empty, but we wont be checked the thrown excpetion
        })
    });

    describe('createTask', () => {
        it('Calls taskRepository.createTask() and return the result', async () => {
            taskRepository.createTask.mockResolvedValue('SomeTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = { title: 'Test Task', description: 'Test Desc' };
            const result = await tasksService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('SomeTask')
        })

    })

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task and deletes the tasks', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });

            expect(taskRepository.delete).not.toHaveBeenCalled();

            const result = await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});
            // expect(result).toEqual

        });

        it('calls taskRepository.deleteTask() and throws an error as task is not found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    })

    describe('updateTaskStatus', () => {
        it('updates a task status', async () => {
            const save = jest.fn().mockResolvedValue(true)

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        })
    })

})