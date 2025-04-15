import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TestsService } from '../tests/tests.service';
import { FindQuestionCriteriasDto } from './dto/find-question-criterias.dto';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly testsService: TestsService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new question',
  })
  @ApiResponse({
    status: 201,
    description: 'The question has been successfully created.',
    schema: {
      example: {
        success: true,
        message: 'Create question successfully',
        data: {
          id: 8,
          test_id: 2,
          question_text: 'What is your name?',
          question_type: 'essay',
          score: 10,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request from user',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        errors: [
          {
            property: 'test_id',
            constraints: 'test_id must be a number',
          },
        ],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error',
        errors: null,
      },
    },
  })
  @ApiBody({
    type: CreateQuestionDto,
    examples: {
      user_1: {
        summary: 'Create a new question',
        description: 'Create a new question',
        value: {
          test_id: 1,
          question_text: 'What is your name?',
          question_type: 'essay',
          score: 10,
        },
      },
    },
  })
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto, @Res() res) {
    try {
      const existingTest = await this.testsService.findOne(
        createQuestionDto.test_id,
      );
      if (!existingTest) throw new BadRequestException('No test match test_id');
      const newQuestion = await this.questionsService.create(createQuestionDto);
      this.logger.debug('Create question successfully');
      this.response.initResponse(
        true,
        'Create question successfully',
        newQuestion,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating question', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating question',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @Post('/criterias')
  async findByCriterias(
    @Body() findQuestionCriteriasDto: FindQuestionCriteriasDto,
    @Res() res,
  ) {
    try {
      const existingQuestions = await this.questionsService.findByCriterias(
        findQuestionCriteriasDto,
      );
      this.logger.debug('Finding questions successfully');
      this.response.initResponse(
        true,
        'Finding questions successfully',
        existingQuestions,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding questions', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding questions',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get all questions',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all questions successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all questions successfully',
        data: [
          {
            id: 2,
            test_id: 5,
            question_text: 'as',
            question_type: 'multiple_choice',
            score: 5,
          },
          {
            id: 3,
            test_id: 6,
            question_text: 'as',
            question_type: 'multiple_choice',
            score: 10,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error',
        errors: null,
      },
    },
  })
  @Get()
  async findAll(@Res() res) {
    try {
      const questions = await this.questionsService.findAll();
      this.logger.debug('Find all questions successfully');
      this.response.initResponse(
        true,
        'Finding all questions successfully',
        questions,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all questions', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all questions',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get a question by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the question to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding question successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding question successfully',
        data: {
          id: 4,
          test_id: 6,
          question_text: 'as',
          question_type: 'multiple_choice',
          score: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error',
        errors: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const question = await this.questionsService.findOne(+id);
      this.logger.debug('Finding question successfully');
      this.response.initResponse(
        true,
        'Finding question successfully',
        question,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding question', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding question',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update a question by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the question to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating question successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating question successfully',
        data: {
          id: 1,
          test_id: 2,
          question_text: 'sjdf\ndalsmdf\njasda',
          question_type: 'essay',
          score: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error',
        errors: null,
      },
    },
  })
  @ApiBody({
    type: UpdateQuestionDto,
    required: false,
    examples: {
      user_1: {
        summary: 'Update an existing question',
        description: 'Update an existing question',
        value: {
          test_id: 1,
          question_text: 'What is your name?',
          question_type: 'essay',
          score: 10,
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Res() res,
  ) {
    try {
      const updatedQuestion = await this.questionsService.update(
        +id,
        updateQuestionDto,
      );
      this.logger.debug('Updating question successfully');
      this.response.initResponse(
        true,
        'Updating question successfully',
        updatedQuestion,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating question', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating question',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete a question by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the question to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting question successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting question successfully',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error',
        errors: null,
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedQuestion = await this.questionsService.remove(+id);
      this.logger.debug('Deleting question successfully');
      this.response.initResponse(
        true,
        'Deleting question successfully',
        deletedQuestion,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting question', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting question',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
