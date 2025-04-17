import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { FindUserCriteriaDto } from './dto/find-user-criteria.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const {
      role_id,
      email,
      first_name,
      last_name,
      phone_number,
      refresh_token = null,
    } = createUserDto;
    const query = `
          INSERT INTO users (name, description)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
    const values = [
      role_id,
      email,
      first_name,
      last_name,
      phone_number,
      refresh_token,
    ];
    const [result] = await this.dataSource.query(query, values);
    return result;
  }

  async findByCriterias(criteria: FindUserCriteriaDto): Promise<User[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM users ${whereClause}`;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<User[]> {
    const query = `SELECT * FROM users;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<User> {
    const query = `
          SELECT * FROM users
          WHERE id = $1;
        `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateUserDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateUserDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
          UPDATE users
          SET ${updates.join(', ')}
          WHERE id = $${index}
          RETURNING *;
        `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
          DELETE FROM users
          WHERE id = $1;
        `;
    await this.dataSource.query(query, [id]);
  }
}
