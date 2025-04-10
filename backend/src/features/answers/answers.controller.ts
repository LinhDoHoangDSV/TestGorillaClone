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
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private readonly answersService: AnswersService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new answer',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request from user',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        errors: [
          {
            property: 'question_text',
            constraints: 'Attribute question_text is not allowed',
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
  @ApiBody({
    type: CreateAnswerDto,
    required: true,
    examples: {
      user_1: {
        summary: 'Create a new answer',
        description: 'Create a new answer',
        value: {
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
        },
      },
    },
  })
  @Post()
  async create(@Body() createAnswerDto: CreateAnswerDto, @Res() res) {
    try {
      const newAnswer = await this.answersService.create(createAnswerDto);
      this.logger.debug('Creating answer successfully');
      this.response.initResponse(
        true,
        'Creating answer successfully',
        newAnswer,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating answer',
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
    description: 'Finding all answers successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all answers successfully',
        data: [
          {
            id: 2,
            question_id: 5,
            option_text: 'kjasd',
            is_correct: true,
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
      const answers = await this.answersService.findAll();
      this.logger.debug('Finding all answers successfully');
      this.response.initResponse(
        true,
        'Finding all answers successfully',
        answers,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all answers', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all answers',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
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
      const answer = await this.answersService.findOne(+id);
      this.logger.debug('Finding answer successfully');
      this.response.initResponse(true, 'Finding answer successfully', answer);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
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
    type: UpdateAnswerDto,
    required: false,
    examples: {
      user_1: {
        summary: 'Update an existing question',
        description: 'Update an existing question',
        value: {
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Res() res,
  ) {
    try {
      const updatedAnswer = await this.answersService.update(
        +id,
        updateAnswerDto,
      );
      this.logger.debug('Updating answer successfully');
      this.response.initResponse(
        true,
        'Updating answer successfully',
        updatedAnswer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting answer successfully',
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
      const deletedAnswer = await this.answersService.remove(+id);
      this.logger.debug('Deleting answer successfully');
      this.response.initResponse(
        true,
        'Deleting answer successfully',
        deletedAnswer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
