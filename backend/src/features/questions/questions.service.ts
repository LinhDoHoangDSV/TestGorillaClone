import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Question } from './entities/question.entity';
import { FindQuestionCriteriasDto } from './dto/find-question-criterias.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question | null> {
    const {
      test_id,
      question_text,
      question_type,
      score = 5,
    } = createQuestionDto;
    const query = `
      INSERT INTO questions (test_id, question_text, question_type, score)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [test_id, question_text, question_type, score];
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async findByCriterias(
    findQuestionCriteriasDto: FindQuestionCriteriasDto,
  ): Promise<Question[] | null> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const key in findQuestionCriteriasDto) {
      conditions.push(`${key} = $${conditions.length + 1}`);
      values.push(findQuestionCriteriasDto[key]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM questions ${whereClause}`;
    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<Question[]> {
    const query = `SELECT * FROM questions;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<Question | null> {
    const query = `
      SELECT * FROM questions
      WHERE id = $1;
    `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateQuestionDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateQuestionDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
      UPDATE questions
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *;
    `;
    const [result] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
      DELETE FROM questions
      WHERE id = $1;
    `;
    await this.dataSource.query(query, [id]);
  }
}
