import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmSettings = () => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [path.join(__dirname, '../../**/entities', '*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '../migrations', '*{.ts,.js}')],
    synchronize: process.env.SYNCRONIZE == 'true',
    autoLoadEntities: true,
    migrationsRun: process.env.RUN_MIGRATIONS == 'true',
    ssl:
      process.env.NODE_ENV === 'DEV'
        ? undefined
        : {
            rejectUnauthorized: false,
          },
    logging: 'all',
  } as TypeOrmModuleOptions;
};

export default new DataSource(typeOrmSettings() as DataSourceOptions);
