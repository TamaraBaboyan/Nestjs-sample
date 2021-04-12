import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';


export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    /**
     * whatever we return from this function is going to be set to the parameter that is decorated with this decorator
     */
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
