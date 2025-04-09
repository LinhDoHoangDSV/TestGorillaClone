import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const newAnswer = await this.dataSource.query(
      `INSERT INTO answers (question_id, option_text, is_correct)
        VALUES (${createAnswerDto.question_id}, '${createAnswerDto.option_text}', ${createAnswerDto.is_correct ? createAnswerDto.is_correct : false})
        RETURNING *;`,
    );
    return newAnswer[0];
  }

  async findAll(): Promise<Answer[]> {
    const result = await this.dataSource.query(`SELECT * FROM answers;`);
    return result;
  }

  async findOne(id: number): Promise<Answer> {
    const result = await this.dataSource.query(
      `SELECT * FROM answers
        WHERE ID = ${id}`,
    );
    return result[0] ? result[0] : null;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto): Promise<Answer> {
    let sampleText = '';

    for (const i in updateAnswerDto) {
      sampleText += `${i} = ${typeof updateAnswerDto[i] != 'string' ? updateAnswerDto[i] : `'${updateAnswerDto[i]}'`}, `;
    }

    if (sampleText == '') return this.findOne(id);

    const updatedQuestion = await this.dataSource.query(
      `UPDATE answers
        SET ${sampleText.slice(0, -2)}
        WHERE id = ${id}
        RETURNING *;`,
    );
    return updatedQuestion[0][0] ? updatedQuestion[0][0] : null;
  }

  async remove(id: number) {
    await this.dataSource.query(
      `DELETE FROM answers
        WHERE id = ${id};`,
    );
    return null;
  }
}
