import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Test } from './entities/test.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const newTest = await this.dataSource.query(
      `INSERT INTO tests (owner_id, title, description, test_time)
      VALUES (${createTestDto.owner_id}, '${createTestDto.title}', '${createTestDto.description}', ${createTestDto.test_time})
      RETURNING *;`,
    );
    return newTest[0];
  }

  async findAll(): Promise<Test[]> {
    const result = await this.dataSource.query(`SELECT * FROM tests;`);
    return result;
  }

  async findOne(id: number): Promise<Test> {
    const result = await this.dataSource.query(
      `SELECT * FROM tests
      WHERE id = ${id};`,
    );
    return result[0] ? result[0] : null;
  }

  async update(id: number, updateTestDto: UpdateTestDto): Promise<Test> {
    let sampleText = '';

    for (const i in updateTestDto) {
      sampleText += `${i} = ${typeof updateTestDto[i] != 'string' ? updateTestDto[i] : `'${updateTestDto[i]}'`}, `;
    }

    if (sampleText == '') return this.findOne(id);

    const updatedTest = await this.dataSource.query(
      `UPDATE tests
        SET ${sampleText.slice(0, -2)}
        WHERE id = ${id}
        RETURNING *;`,
    );
    return updatedTest[0][0] ? updatedTest[0][0] : null;
  }

  async remove(id: number) {
    await this.dataSource.query(
      `DELETE FROM tests
      WHERE id = ${id};`,
    );
    return null;
  }
}
