import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const newQuestion = await this.dataSource.query(
      `INSERT INTO questions (test_id, question_text, question_type, score)
      VALUES (${createQuestionDto.test_id}, '${createQuestionDto.question_text}', '${createQuestionDto.question_type}', ${createQuestionDto.score ? createQuestionDto.score : 5})
      RETURNING *;`,
    );
    return newQuestion[0];
  }

  async findAll(): Promise<Question[]> {
    const result = await this.dataSource.query(`SELECT * FROM questions;`);
    return result;
  }

  async findOne(id: number): Promise<Question> {
    const result = await this.dataSource.query(
      `SELECT * FROM questions
      WHERE ID = ${id};`,
    );
    return result[0] ? result[0] : null;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    let sampleText = '';

    for (const i in updateQuestionDto) {
      sampleText += `${i} = ${updateQuestionDto[i]}, `;
    }

    if (sampleText == '') return this.findOne(id);

    const updatedQuestion = await this.dataSource.query(
      `UPDATE questions
      ${sampleText != '' ? `SET ${sampleText.slice(0, -2)}` : ''}
      WHERE id = ${id}
      RETURNING *;`,
    );
    return updatedQuestion[0][0] ? updatedQuestion[0][0] : null;
  }

  async remove(id: number) {
    await this.dataSource.query(
      `DELETE FROM questions
      WHERE id = ${id};`,
    );
    return null;
  }
}
