import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Statistic } from './entities/statistic.entity';
import { FindStatisticCriteriaDto } from './dto/find-statistic-criteria.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createStatisticDto: CreateStatisticDto,
    manager?: EntityManager,
  ): Promise<Statistic> {
    const {
      user_id,
      total_invitation = 0,
      active_assess = 0,
      total_assess_complete = 0,
    } = createStatisticDto;

    const query = `
      INSERT INTO statistics (user_id, total_invitation, active_assess, total_assess_complete)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      user_id,
      total_invitation,
      active_assess,
      total_assess_complete,
    ];

    const [result] = manager
      ? await manager.query(query, values)
      : await this.dataSource.query(query, values);

    return result as Statistic;
  }

  async findByCriterias(
    criteria: FindStatisticCriteriaDto,
  ): Promise<Statistic[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    for (const i in criteria) {
      conditions.push(`${i} = $${conditions.length + 1}`);
      values.push(criteria[i]);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `SELECT * FROM statistics ${whereClause}`;

    const result = await this.dataSource.query(query, values);
    return result;
  }

  async findAll(): Promise<Statistic[]> {
    const query = `SELECT * FROM statistics;`;
    const result = await this.dataSource.query(query);
    return result;
  }

  async findOne(id: number): Promise<Statistic> {
    const query = `
          SELECT * FROM statistics
          WHERE id = $1;
        `;
    const [result] = await this.dataSource.query(query, [id]);
    return result || null;
  }

  async update(
    id: number,
    updateStatisticDto: UpdateStatisticDto,
  ): Promise<Statistic> {
    const updates: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const key in updateStatisticDto) {
      updates.push(`${key} = $${index}`);
      values.push(updateStatisticDto[key]);
      index++;
    }

    if (updates.length === 0) {
      return this.findOne(id);
    }

    values.push(id);
    const query = `
          UPDATE statistics
          SET ${updates.join(', ')}
          WHERE id = $${index}
          RETURNING *;
        `;
    const [[result]] = await this.dataSource.query(query, values);
    return result || null;
  }

  async remove(id: number): Promise<void> {
    const query = `
          DELETE FROM statistics
          WHERE id = $1;
        `;
    await this.dataSource.query(query, [id]);
  }
}
