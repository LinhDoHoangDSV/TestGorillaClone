import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { TestAssignmentController } from './test-assignment.controller';
import { TestAssignmentService } from './test-assignment.service';
import { TestsService } from '../tests/tests.service';
import { MailService } from '../mail-service/mail-service.service';
import { StatisticsService } from '../statistics/statistics.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { Response as ResponseUtil } from '../response/response';
import { InviteTestDto } from './dto/invite-test.dto';
import { CreateTestAssignmentDto } from './dto/create-test-assignment.dto';
import { FindTestAssignmentCriteriaDto } from './dto/find-test-assignment-criteria.dto';
import { TestAssignmentStatus } from 'src/common/constant';

const mockQueryService = () => ({
  findOne: jest.fn(),
  findByCriterias: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
const mockResponseUtil = () => ({ initResponse: jest.fn() });
const mockLogger = () => ({ debug: jest.fn(), error: jest.fn() });

const testsService = mockQueryService();
const testAssignmentService = mockQueryService();
const mailService = { requestTest: jest.fn() };
const statisticsService = {
  findByCriterias: jest.fn(),
  update: jest.fn(),
};
const schedulerRegistry = {} as SchedulerRegistry;
const configService = {
  get: jest.fn().mockReturnValue('http://localhost:4200'),
};

describe('TestAssignmentController', () => {
  let controller: TestAssignmentController;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestAssignmentController],
      providers: [
        { provide: TestAssignmentService, useValue: testAssignmentService },
        { provide: TestsService, useValue: testsService },
        { provide: MailService, useValue: mailService },
        { provide: StatisticsService, useValue: statisticsService },
        { provide: SchedulerRegistry, useValue: schedulerRegistry },
        { provide: ConfigService, useValue: configService },
        { provide: LoggerService, useValue: mockLogger() },
        { provide: ResponseUtil, useValue: mockResponseUtil() },
      ],
    }).compile();

    controller = module.get(TestAssignmentController);
  });

  describe('create()', () => {
    const dto: CreateTestAssignmentDto = {
      test_id: 1,
      candidate_email: 'foo@bar.com',
      code: '123456',
      expired_invitation: null,
      started_at: null,
      is_online: false,
      score: null,
      status: TestAssignmentStatus.NOT_STARTED,
    };

    it('201, tạo thành công', async () => {
      testsService.findOne.mockResolvedValue({ id: 1 });
      testAssignmentService.create.mockResolvedValue({ id: 99, ...dto });

      await controller.create(dto, res);

      expect(testsService.findOne).toHaveBeenCalledWith(1);
      expect(testAssignmentService.create).toHaveBeenCalledWith(dto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalled();
    });

    it('400, test_id không tồn tại', async () => {
      testsService.findOne.mockResolvedValue(null);

      await controller.create(dto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('findByCriterias()', () => {
    const criteria: FindTestAssignmentCriteriaDto = {
      candidate_email: 'linh@gmail.com.com',
    };

    it('200, trả về danh sách', async () => {
      testAssignmentService.findByCriterias.mockResolvedValue([{ id: 1 }]);

      await controller.findByCriterias(criteria, res);

      expect(testAssignmentService.findByCriterias).toHaveBeenCalledWith(
        criteria,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('inviteTest()', () => {
    const req = { user: { userId: 7 } } as any;

    it('200, gửi mail và update statistic', async () => {
      const dto: InviteTestDto = {
        test_id: 1,
        emails: 'linh@gmail.com, linhdh@gmail.com',
      } as any;
      testsService.findOne.mockResolvedValue({ id: 1, owner_id: 7 });
      testAssignmentService.create.mockResolvedValue({ id: 100 });
      statisticsService.findByCriterias.mockResolvedValue([
        { id: 50, total_invitation: 0 },
      ]);

      await controller.inviteTest(dto, res, req);
      await new Promise(process.nextTick);

      expect(testAssignmentService.create).toHaveBeenCalledTimes(2);
      expect(mailService.requestTest).toHaveBeenCalledTimes(2);
      expect(statisticsService.update).toHaveBeenCalledWith(50, {
        total_invitation: 2,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('400, test_id không tồn tại', async () => {
      const dto: InviteTestDto = {
        test_id: 99,
        emails: 'linh@gmail.com',
      } as any;
      testsService.findOne.mockResolvedValue(null);

      await controller.inviteTest(dto, res, req);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });
});
