import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { FindRolesCriteriasDto } from './dto/find-criteria-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role | null> {
    const { name, description } = createRoleDto;
    const query = `
        INSERT INTO roles (name, description)
        VALUES ($1, $2)
        RETURNING *;
      `;
    const values = [name, description];
    const [result] = await this.dataSource.query(query, values);
    return result;
  }

  async findByCriterias(criteria: FindRolesCriteriasDto): Promise<Role[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM roles ${whereClause}`;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<Role[]> {
    const query = `SELECT * FROM roles;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<Role> {
    const query = `
        SELECT * FROM roles
        WHERE id = $1;
      `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateRoleDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateRoleDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
        UPDATE roles
        SET ${updates.join(', ')}
        WHERE id = $${index}
        RETURNING *;
      `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
        DELETE FROM roles
        WHERE id = $1;
      `;
    await this.dataSource.query(query, [id]);
  }
}
