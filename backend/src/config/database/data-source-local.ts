import { DataSource, DataSourceOptions } from 'typeorm';

const connectionOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'linh310304',
  database: 'TestGorillaDev',
  synchronize: false,
  logging: true,
  entities: ['dist/features/**/entities/*{.ts,.js}'],
  migrations: ['dist/config/database/migration/*{.ts,.js}'],
};

export default new DataSource({
  ...connectionOptions,
});
