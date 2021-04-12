import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    // There could be many tasks for one user
    // first: type of this property, user entity
    // second: on the invert side of this relationship, the user. where in the user entity we can find those tasks? many tasks
    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User

    @Column()
    userId: number

}