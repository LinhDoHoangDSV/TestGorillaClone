import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Res,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { QuestionsService } from '../questions/questions.service';
import { TestAssignmentService } from '../test-assignment/test-assignment.service';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { FindUserAnswersCriteriaDto } from './dto/find-user-answer-criteria.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { Roles } from 'src/common/constant';
import { SubmitCodeDto } from './dto/submit-code.dto';

@Controller('user-answers')
export class UserAnswersController {
  constructor(
    private readonly userAnswersService: UserAnswersService,
    private readonly questionsService: QuestionsService,
    private readonly testAssignmentService: TestAssignmentService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new role',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating role successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating role successfully',
        data: {
          id: 1,
          name: 'HR',
          description: 'Some one called HR',
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
    type: CreateUserAnswerDto,
    required: true,
    examples: {
      user_1: {
        summary: 'Create a new role',
        description: 'Create a new role',
        value: {
          name: 'HR',
          description: 'Some one called HR',
        },
      },
    },
  })
  @Post()
  async create(@Body() createUserAnswerDto: CreateUserAnswerDto, @Res() res) {
    try {
      const existingTestAssignment = await this.testAssignmentService.findOne(
        createUserAnswerDto.test_assignment_id,
      );

      if (!existingTestAssignment)
        throw new BadRequestException('test_assignment do not exist');

      const existingQuestion = await this.questionsService.findOne(
        createUserAnswerDto.question_id,
      );

      if (!existingQuestion)
        throw new BadRequestException('question do not exist');

      const newUserAnswer =
        await this.userAnswersService.create(createUserAnswerDto);

      this.logger.debug('Creating user_answer successfully');
      this.response.initResponse(
        true,
        'Creating user_answer successfully',
        newUserAnswer,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @Post('/submit')
  async submitCode(@Body() submitCodeDto: SubmitCodeDto, @Res() res) {
    try {
      const result = await this.userAnswersService.submitCode(submitCodeDto);
      const result2 = await this.userAnswersService.getResultCode(
        result?.token,
      );
      console.log(result2);
      this.logger.debug('Submit code successfully');
      this.response.initResponse(true, 'Submit code successfully', result2);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while submitting code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while submitting code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find roles by criteria',
  })
  @ApiResponse({
    status: 201,
    description: 'Finding roles successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding roles successfully',
        data: [
          {
            id: 1,
            name: 'HR',
            description: 'Some one called HR',
          },
        ],
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
    type: FindUserAnswersCriteriaDto,
    required: false,
    examples: {
      user_1: {
        summary: 'Find roles by criterias',
        description: 'Find roles by criterias',
        value: {
          name: 'HR',
          description: 'Some one called HR',
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Post('/criterias')
  async findByCriterias(
    @Body() findUserAnswersCriteriaDto: FindUserAnswersCriteriaDto,
    @Res() res,
  ) {
    try {
      const existingUserAnswer = await this.userAnswersService.findByCriterias(
        findUserAnswersCriteriaDto,
      );
      this.logger.debug('Finding user_answer successfully');
      this.response.initResponse(
        true,
        'Finding user_answer successfully',
        existingUserAnswer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get all roles',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all roles successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all roles successfully',
        data: [
          {
            id: 1,
            name: 'HR',
            description: 'Some one called HR',
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
      const user_answer = await this.userAnswersService.findAll();
      this.logger.debug('Finding all user_answer successfully');
      this.response.initResponse(
        true,
        'Finding all user_answer successfully',
        user_answer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get role by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the role to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding role successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding role successfully',
        data: {
          id: 1,
          name: 'HR',
          description: 'Some one called HR',
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
      const user_answer = await this.userAnswersService.findOne(+id);
      this.logger.debug('Finding user_answer successfully');
      this.response.initResponse(
        true,
        'Finding user_answer successfully',
        user_answer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update role by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the role to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating role successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating role successfully',
        data: {
          id: 1,
          name: 'HR',
          description: 'Some one called HR',
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
    type: UpdateUserAnswerDto,
    required: false,
    examples: {
      user_1: {
        summary: 'Update an existing role',
        description: 'Update an existing role',
        value: {
          name: 'HR',
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
    @Res() res,
  ) {
    try {
      const updatedUserAnswer = await this.userAnswersService.update(
        +id,
        updateUserAnswerDto,
      );
      this.logger.debug('Updating user_answer successfully');
      this.response.initResponse(
        true,
        'Updating user_answer successfully',
        updatedUserAnswer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete role by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the role to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting role successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting role successfully',
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
      const deletedUserAnswer = await this.userAnswersService.remove(+id);
      this.logger.debug('Deleting user_answer successfully');
      this.response.initResponse(
        true,
        'Deleting user_answer successfully',
        deletedUserAnswer,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting user_answer', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting user_answer',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
