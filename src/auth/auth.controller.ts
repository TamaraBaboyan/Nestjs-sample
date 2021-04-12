import { Body, Controller, Post, UseGuards, ValidationPipe, Req } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // console.log(authCredentialsDto);
        return this.authService.signup(authCredentialsDto)
    }

    @Post('/signin')
    signin(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signin(authCredentialsDto)
    }

    @Post('/test')
    @UseGuards(AuthGuard())    // we can apply guards in the controller level OR on a single route
    test(@GetUser() user: User) {
        console.log(user) // we can see user is extracted from user by @GetUser decorator
    }

    @Post('/test2')
    @UseGuards(AuthGuard())    // we can apply guards in the controller level OR on a single route
    test2(@Req() req) {
        console.log(req.user)  // we see it's logged a big request object and the "User" object inside it and this is AWESOME,
                          // we can use the guard in any rout that we need a user, auth middleware
    }
}
