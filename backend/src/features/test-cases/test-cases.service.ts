import { Injectable } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TestCase } from './entities/test-case.entity';
import { FindTestCasesDto } from './dto/find-test-case.dto';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTestCasesDto: CreateTestCaseDto,
  ): Promise<TestCase | null> {
    const { question_id, input, expected_output } = createTestCasesDto;
    const query = `
        INSERT INTO test_cases (question_id, input, expected_output)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const values = [question_id, input, expected_output];
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async findByCriterias(
    findTestCasesDto: FindTestCasesDto,
  ): Promise<TestCase[] | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const key in findTestCasesDto) {
      conditions.push(`${key} = $${conditions.length + 1}`);
      values.push(findTestCasesDto[key]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM test_cases
      ${whereClause}
      ORDER BY id;
      `;
    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<TestCase[]> {
    const query = `
      SELECT * FROM test_cases
      ORDER BY id;
      `;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<TestCase | null> {
    const query = `
        SELECT * FROM test_cases
        WHERE id = $1;
      `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateTestCaseDto: UpdateTestCaseDto,
  ): Promise<TestCase | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateTestCaseDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateTestCaseDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);

    const query = `
        UPDATE test_cases
        SET ${updates.join(', ')}
        WHERE id = $${index}
        RETURNING *;
      `;
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
        DELETE FROM test_cases
        WHERE id = $1;
      `;
    await this.dataSource.query(query, [id]);
  }
}
