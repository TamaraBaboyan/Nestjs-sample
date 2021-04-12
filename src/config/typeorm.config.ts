import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";

const dbConfig = config.get('db')

export const typeormConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host:  process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    autoLoadEntities: true,
    synchronize: dbConfig.synchronize // it's good idea to be true in dev mode bdz we constantly change our ORM config, 
    // but in production we set it false, it's ok if we set it true for the first time we deploy the application, so we don't have to manually setup the schemas
}

/**
 * In productin environment, we MUST provide sensitive information/credentials in ENV variables.
 * we are going to define as RDS env variable, 
 * RDS stands for: Relational database service, it's service in AWS and that is the service that we are going to use as database for production.
 * we need to use specific env variable names, so when we deploy our application, AWS will inject those vars with DB connection.
 * 
 * In the production env those RDS variables will be provides to us by elastic bean stalk which is the service we are going to use to deploy our application.
 */