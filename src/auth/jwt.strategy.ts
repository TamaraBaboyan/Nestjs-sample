import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as config from 'config'


// This class is a strategy that will be used by passport, so we will make it injectable

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret') // we must provide the same secret key we used in the module, this secret passport is going to use to verify the signature of the token that is extracted from the request
        });
    }

    // the method must exist in every stratgey, it takes payload as parameter and this payload is already verified at this point.
    // First passportJs verifies the signature using the secret, if it is not valid will throw an err, if it IS valid will call this validate method
    // Whatever we returned from here is going to be injected into the "request" of any operation guarded with authentication
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}

// Now this service can be added as provider in Auth Module 

