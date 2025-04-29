import { Injectable } from '@nestjs/common';
import { CreateInitialCodeDto } from './dto/create-initial-code.dto';
import { UpdateInitialCodeDto } from './dto/update-initial-code.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InitialCode } from './entities/initial-code.entity';
import { FindInitialCodeDto } from './dto/find-initial-code.dto';

@Injectable()
export class InitialCodesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createInitialCodeDto: CreateInitialCodeDto,
  ): Promise<InitialCode | null> {
    const {
      question_id,
      language_id,
      description = '',
      initial_code,
    } = createInitialCodeDto;
    const query = `
          INSERT INTO initial_codes (question_id, language_id, description, initial_code)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
        `;
    const values = [question_id, language_id, description, initial_code];
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async findByCriterias(
    findInitialCodeDto: FindInitialCodeDto,
  ): Promise<InitialCode[] | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const key in findInitialCodeDto) {
      conditions.push(`${key} = $${conditions.length + 1}`);
      values.push(findInitialCodeDto[key]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM initial_codes
        ${whereClause}
        ORDER BY id;
        `;
    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<InitialCode[]> {
    const query = `
        SELECT * FROM initial_codes
        ORDER BY id;
        `;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<InitialCode | null> {
    const query = `
          SELECT * FROM initial_codes
          WHERE id = $1;
        `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateInitialCodeDto: UpdateInitialCodeDto,
  ): Promise<InitialCode | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateInitialCodeDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateInitialCodeDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);

    const query = `
          UPDATE initial_codes
          SET ${updates.join(', ')}
          WHERE id = $${index}
          RETURNING *;
        `;
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
          DELETE FROM initial_codes
          WHERE id = $1;
        `;
    await this.dataSource.query(query, [id]);
  }
}
