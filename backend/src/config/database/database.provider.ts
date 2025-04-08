/* eslint-disable prettier/prettier */

import { DATASOURCE } from 'src/common/constant';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATASOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: (process.env.DB_TYPE as 'postgres') || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
