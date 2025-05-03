import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('DB_URL'),
  synchronize: false,
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migration', '*.{ts,js}')],
  logging: true,
});

export default AppDataSource;
