import { Test, TestingModule } from '@nestjs/testing';
import { TestAssignmentService } from './test-assignment.service';
import { DataSource } from 'typeorm';
import { TestAssignmentStatus } from 'src/common/constant';

describe('TestAssignmentService', () => {
  let service: TestAssignmentService;
  let dataSourceMock: { query: jest.Mock };

  beforeEach(async () => {
    dataSourceMock = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestAssignmentService,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<TestAssignmentService>(TestAssignmentService);
  });

  describe('create', () => {
    it('should insert and return new test-assignment', async () => {
      const dto = {
        test_id: 1,
        candidate_email: 'alice@example.com',
        expired_invitation: null,
        started_at: null,
        is_online: false,
        score: 0,
        code: 'ABC123',
        status: TestAssignmentStatus.NOT_STARTED,
      };
      const expected = { id: 100, ...dto };

      dataSourceMock.query.mockResolvedValueOnce([expected]);

      const result = await service.create(dto);

      expect(dataSourceMock.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('findByCriterias', () => {
    it('should return test-assignments correctly', async () => {
      const criteria = { candidate_email: 'alice@example.com', test_id: 1 };
      const expected = [{ id: 1 }];

      dataSourceMock.query.mockResolvedValueOnce(expected);

      const result = await service.findByCriterias(criteria);

      expect(dataSourceMock.query.mock.calls[0][1]).toEqual([
        criteria.candidate_email,
        criteria.test_id,
      ]);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all test-assignments', async () => {
      const expected = [{ id: 1 }, { id: 2 }];
      dataSourceMock.query.mockResolvedValueOnce(expected);

      const result = await service.findAll();

      expect(dataSourceMock.query).toHaveBeenCalledWith(
        'SELECT * FROM test_assignment;',
      );
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return one test-assignment by id', async () => {
      const expected = { id: 42 };
      dataSourceMock.query.mockResolvedValueOnce([expected]);

      const result = await service.findOne(42);

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update selected test-assignment and return updated value', async () => {
      const dto = { score: 95, status: TestAssignmentStatus.COMPLETED };
      const expected = { id: 10, ...dto };

      dataSourceMock.query.mockResolvedValueOnce([[expected]]);

      const result = await service.update(10, dto);

      const values = dataSourceMock.query.mock.calls[0][1];
      expect(values[values.length - 1]).toBe(10);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should delete by id', async () => {
      dataSourceMock.query.mockResolvedValueOnce(undefined);

      await service.remove(7);

      expect(dataSourceMock.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM test_assignment'),
        [7],
      );
    });
  });
});
