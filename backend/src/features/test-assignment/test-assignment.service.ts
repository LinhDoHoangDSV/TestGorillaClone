import { Injectable } from '@nestjs/common';
import { CreateTestAssignmentDto } from './dto/create-test-assignment.dto';
import { UpdateTestAssignmentDto } from './dto/update-test-assignment.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TestAssignment } from './entities/test-assignment.entity';
import { TestAssignmentStatus } from 'src/common/constant';
import { FindTestAssignmentCriteriaDto } from './dto/find-test-assignment-criteria.dto';

@Injectable()
export class TestAssignmentService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createTestAssignmentDto: CreateTestAssignmentDto,
  ): Promise<TestAssignment | null> {
    const {
      test_id,
      candidate_email,
      expired_invitation = null,
      started_at = null,
      is_online = false,
      score = 0,
      code,
      count_exit = 0,
      status = TestAssignmentStatus.NOT_STARTED,
    } = createTestAssignmentDto;
    const query = `
          INSERT INTO test_assignment (test_id, candidate_email, expired_invitation, started_at, is_online, score, code, count_exit, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
        `;
    const values = [
      test_id,
      candidate_email,
      expired_invitation,
      started_at,
      is_online,
      score,
      code,
      count_exit,
      status,
    ];
    const [result] = await this.dataSource.query(query, values);
    return result;
  }

  async findByCriterias(
    criteria: FindTestAssignmentCriteriaDto,
  ): Promise<TestAssignment[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM test_assignment ${whereClause}`;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<TestAssignment[]> {
    const query = `SELECT * FROM test_assignment;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<TestAssignment> {
    const query = `
          SELECT * FROM test_assignment
          WHERE id = $1;
        `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateTestAssignmentDto: UpdateTestAssignmentDto,
  ): Promise<TestAssignment> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateTestAssignmentDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateTestAssignmentDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
          UPDATE test_assignment
          SET ${updates.join(', ')}
          WHERE id = $${index}
          RETURNING *;
        `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
          DELETE FROM test_assignment
          WHERE id = $1;
        `;
    await this.dataSource.query(query, [id]);
  }
}
