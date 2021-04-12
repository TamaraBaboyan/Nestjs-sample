import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username']) // list here all the columns that we want to be unique
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    // tasks will be the one to many side of this relationship, one user has many tasks

    // first: type: entity type, 
    // second: the inverst side of this relationship, how we could access the user that owns the task 
    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];  // using this properoty on the user entity will retrive the tasks a user owns

    // we write this here, because we are running business logic on a specific user instance
    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return (hash === this.password);
    }
}

/**
 * eager property: when eacher is set to true, whenever we retrieve the user as an object, we do: user.tasks and retrieve array of tasks owned by that user immediately
 * one side of the relationship can be eager, not both of the sides.
*/