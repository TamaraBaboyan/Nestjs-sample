import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap'); // we provide context as first argument. so when logs displayed in the console, context is also displayed
  const app = await NestFactory.create(AppModule);
  
  if (process.env.NODE_ENV === 'development') {
      app.enableCors(); // exposes api to the public, however I don't want to this always happen and set NODE_ENV in package.json scripts
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting requests from origin "${ serverConfig.origin }"`);
  }

  const port = process.env.PORT || serverConfig.port  // the priority always goes to env variable. if we want to set PORT as env, then: $ PORT=3005 yarn start:dev
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();

/**
 * Question: how does config know which env we are running on. well, this library uses ENV variable, called NODE_ENV, this common way to determine environment in NodeJS
 * as this NODE_ENV is undefined, then config takes development config by default
 */


/**
 * about CORS: 
 * By default Nestjs server allows request from same origin.
 * Here, In Development mode, We are exposing our API to the public and allowing request from any origin.
 * However, In production we are going to whitelist the origin of my frontend only.
 */