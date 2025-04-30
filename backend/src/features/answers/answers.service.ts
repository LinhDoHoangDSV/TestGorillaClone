import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { FindCriteriasDto } from './dto/find-criterias.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer | null> {
    const { question_id, option_text, is_correct = false } = createAnswerDto;
    const query = `
      INSERT INTO answers (question_id, option_text, is_correct)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [question_id, option_text, is_correct];
    const [result] = await this.dataSource.query(query, values);
    return result;
  }

  async findByCriterias(criteria: FindCriteriasDto): Promise<Answer[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM answers
    ${whereClause}
    ORDER BY id;
    `;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<Answer[]> {
    const query = `
    SELECT * FROM answers
    ORDER BY id;
    `;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<Answer> {
    const query = `
      SELECT * FROM answers
      WHERE id = $1;
    `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateAnswerDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateAnswerDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE answers
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
      DELETE FROM answers
      WHERE id = $1;
    `;
    await this.dataSource.query(query, [id]);
  }
}
