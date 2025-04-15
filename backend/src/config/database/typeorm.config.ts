/******************************************* For neon db *********************************/
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config();

const configService = new ConfigService();
console.log(configService.get<string>('DB_URL'));

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DB_URL'),
  synchronize: false,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')], // Corrected path
  migrations: [join(__dirname, 'migration', '*.{ts,js}')],
  migrationsRun: true,
  logging: true,
});

export default AppDataSource;

// **********************   For local db **************************

// import { DataSource } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { config } from 'dotenv';

// config();

// const configService = new ConfigService();
// const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: configService.get<string>('DB_HOST'),
//   port: parseInt(configService.get<string>('DB_PORT')!, 5432),
//   username: configService.get<string>('DB_USER'),
//   password: configService.get<string>('DB_PASS'),
//   database: configService.get<string>('DB_NAME'),
//   synchronize: false,
//   entities: ['src/features/**/entities/*{.ts,.js}'],
//   migrations: ['src/config/database/migration/*{.ts,.js}'],
//   migrationsRun: false,
//   logging: true,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// export default AppDataSource;
