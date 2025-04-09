import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { DataSource } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QUESTION_TYPE } from '../../common/constant';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    mockDataSource = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new question successfully', async () => {
      const createQuestionDto: CreateQuestionDto = {
        test_id: 1,
        question_text: 'Hello world',
        question_type: QUESTION_TYPE.ESSAY,
        score: 10,
      };
      const mockResult = [{ id: 1, ...createQuestionDto }];
      mockDataSource.query = jest.fn().mockResolvedValue(mockResult);

      const result = await service.create(createQuestionDto);

      expect(result).toEqual(mockResult[0]);
    });

    it('should use default score if not provided', async () => {
      const createQuestionDto: CreateQuestionDto = {
        test_id: 1,
        question_text: 'Hello world',
        question_type: QUESTION_TYPE.ESSAY,
        score: undefined,
      };
      const mockResult = [{ id: 1, ...createQuestionDto, score: 5 }];
      mockDataSource.query = jest.fn().mockResolvedValue(mockResult);

      const result = await service.create(createQuestionDto);

      expect(result).toEqual(mockResult[0]);
    });
  });

  describe('findAll', () => {
    it('should return an array of questions', async () => {
      const mockQuestions = [
        {
          id: 1,
          test_id: 1,
          question_text: 'Hello world',
          question_type: 'essay',
          score: 10,
        },
        {
          id: 2,
          test_id: 1,
          question_text: 'Hello world',
          question_type: 'essay',
          score: 15,
        },
      ];
      mockDataSource.query = jest.fn().mockResolvedValue(mockQuestions);

      const result = await service.findAll();

      expect(result).toEqual(mockQuestions);
    });

    it('should return an empty array if no questions exist', async () => {
      mockDataSource.query = jest.fn().mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single question by id', async () => {
      const mockQuestion = {
        id: 1,
        test_id: 1,
        question_text: 'Hello world',
        question_type: 'essay',
        score: 10,
      };
      mockDataSource.query = jest.fn().mockResolvedValue([mockQuestion]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockQuestion);
    });

    it('should return null if question not found', async () => {
      mockDataSource.query = jest.fn().mockResolvedValue([]);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a question successfully', async () => {
      const updateQuestionDto: UpdateQuestionDto = {
        question_text: 'Updated text',
        score: 20,
      };
      const mockResult = [
        [
          {
            id: 1,
            test_id: 1,
            question_text: 'Updated text',
            question_type: 'single',
            score: 20,
          },
        ],
      ];
      mockDataSource.query = jest.fn().mockResolvedValue(mockResult);

      const result = await service.update(1, updateQuestionDto);

      expect(result).toEqual(mockResult[0][0]);
    });

    it('should return current question if no fields to update', async () => {
      const mockQuestion = {
        id: 1,
        test_id: 1,
        question_text: 'Hello world',
        question_type: 'essay',
        score: 10,
      };
      mockDataSource.query = jest.fn().mockResolvedValueOnce([mockQuestion]);

      const result = await service.update(1, {});

      expect(result).toEqual(mockQuestion);
    });
  });

  describe('remove', () => {
    it('should remove a question successfully', async () => {
      mockDataSource.query = jest.fn().mockResolvedValue([]);

      const result = await service.remove(1);

      expect(result).toBeNull();
    });
  });
});
