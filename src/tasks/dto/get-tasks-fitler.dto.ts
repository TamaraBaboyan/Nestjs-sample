import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE]) // either it doesn't exist or if it exists in url query param, it should have value, can't be like: url?search= 
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string
}