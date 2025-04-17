import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserAnswer } from './entities/user-answer.entity';
import { FindUserAnswersCriteriaDto } from './dto/find-user-answer-criteria.dto';

@Injectable()
export class UserAnswersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createUserAnswerDto: CreateUserAnswerDto,
  ): Promise<UserAnswer | null> {
    const {
      test_assignment_id,
      question_id,
      answer_text,
      score = 0,
    } = createUserAnswerDto;
    const query = `
            INSERT INTO user_answers (test_assignment_id, question_id, answer_text, score)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
          `;
    const values = [test_assignment_id, question_id, answer_text, score];
    const [result] = await this.dataSource.query(query, values);
    return result;
  }

  async findByCriterias(
    criteria: FindUserAnswersCriteriaDto,
  ): Promise<UserAnswer[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM user_answers ${whereClause}`;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<UserAnswer[]> {
    const query = `SELECT * FROM user_answers;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<UserAnswer> {
    const query = `
            SELECT * FROM user_answers
            WHERE id = $1;
          `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateUserAnswerDto: UpdateUserAnswerDto,
  ): Promise<UserAnswer> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateUserAnswerDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateUserAnswerDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
            UPDATE user_answers
            SET ${updates.join(', ')}
            WHERE id = $${index}
            RETURNING *;
          `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
            DELETE FROM user_answers
            WHERE id = $1;
          `;
    await this.dataSource.query(query, [id]);
  }
}
