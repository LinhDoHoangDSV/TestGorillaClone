import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT')!, 5432),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  synchronize: false,
  // entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/../database/migrations/*-migration{.ts,.js}'],
  entities: [
    // 'dist/**/**/*.entity{.ts,.js}',
    'src/features/**/entities/*{.ts,.js}',
    // UserEntity
  ],
  migrations: [
    // __dirname + '/../database/migrations/*-migration{.ts,.js}'
    'src/config/database/migration/*{.ts,.js}',
  ],
  migrationsRun: false,
  logging: true,
  // ssl: false,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false, // if using a self-signed certificate or untrusted certs
  //   },
  // },
});

export default AppDataSource;
