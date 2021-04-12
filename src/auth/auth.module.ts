import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    JwtModule.register({ // here we are set up how JWT module will be used in this module
      secret: process.env.JWT_SECRET || jwtConfig.secret, // secret key of gernerated jwt token
      signOptions: {
        expiresIn: jwtConfig.expiresIn  // JWT token will be valid 1 hour
      },
    }),
    PassportModule.register({ // here we are set up how passport module will be used in this module
      defaultStrategy: 'jwt'
    }),
    TypeOrmModule.forFeature([UserRepository]) // we provide list of entities or repos
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy, // we export it so we can use in other modules who use JWT guarding 
    PassportModule // after we configured we make other modules possible to guard passportjs and jwt
  ]
})

export class AuthModule {}

/**
 * Because we imported JWT module here and JWT module exports a service(a provider) that is called "jwt service", with that service we can perform certain operations,
 * such as creating a token(signing a token), that means I can inject it using dependency injection we did it in auth service
 * 
 */