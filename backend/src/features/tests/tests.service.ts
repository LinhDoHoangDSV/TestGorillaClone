import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Test } from './entities/test.entity';
import { FindTestCriteriasDto } from './dto/find-test-criterias.dto';

@Injectable()
export class TestsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test | null> {
    const {
      owner_id,
      title,
      description,
      test_time,
      is_publish = false,
    } = createTestDto;
    const query = `
      INSERT INTO tests (owner_id, title, description, test_time, is_publish)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      owner_id,
      title,
      description || null,
      test_time,
      is_publish,
    ];
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async findByCriterias(
    findTestCriteriasDto: FindTestCriteriasDto,
  ): Promise<Test[]> {
    const { limit = null, ...remainCriteriaDto } = findTestCriteriasDto;
    let counter: number = 0;
    const conditions: string[] = [];
    const values: any[] = [];
    let limitQuery: string = '';

    for (const key in remainCriteriaDto) {
      conditions.push(`${key} = $${counter + 1}`);
      values.push(remainCriteriaDto[key]);
      counter++;
    }

    if (limit > 0) {
      values.push(limit);
      limitQuery = `LIMIT $${counter + 1}`;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM tests ${whereClause} ${limitQuery}`;
    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<Test[]> {
    const query = `SELECT * FROM tests;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<Test | null> {
    const query = `
      SELECT * FROM tests
      WHERE id = $1;
    `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(id: number, updateTestDto: UpdateTestDto): Promise<Test | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateTestDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateTestDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE tests
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
      DELETE FROM tests
      WHERE id = $1;
    `;
    await this.dataSource.query(query, [id]);
  }
}
