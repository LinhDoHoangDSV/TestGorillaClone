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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionsService } from '../questions/questions.service';
import { TestAssignmentService } from '../test-assignment/test-assignment.service';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { FindUserAnswersCriteriaDto } from './dto/find-user-answer-criteria.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { Roles } from 'src/common/constant';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('User Answers')
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
    summary: 'Create a new user_answer',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating user_answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating user_answer successfully',
        data: {
          id: 78,
          test_assignment_id: 46,
          question_id: 96,
          answer_text: 'hi',
          score: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        data: [
          {
            property: 'test_assignment_ida',
            constraints: 'Attribute test_assignment_ida is not allowed',
          },
          {
            property: 'test_assignment_id',
            constraints: 'Attribute test_assignment_id must exist',
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
        message: 'System error while creating user_answer',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateUserAnswerDto,
    required: true,
    examples: {
      user_answers: {
        summary: 'DTO for creating a new user_answer',
        description: 'Require all fields',
        value: {
          test_assignment_id: 46,
          question_id: 96,
          answer_text: 'hi',
          score: 10,
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

  @ApiOperation({
    summary: 'Submit code for a user_answer',
  })
  @ApiResponse({
    status: 200,
    description: 'Submit code successfully',
    schema: {
      example: {
        success: true,
        message: 'Submit code successfully',
        data: {
          token: 'eaeb562e-3825-45ab-a775-7cb75d561336',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        data: [
          {
            property: 'languageIds',
            constraints: 'Attribute languageIds is not allowed',
          },
          {
            property: 'languageId',
            constraints: 'Attribute languageId must exist',
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
        message: 'System error while submitting code',
        data: null,
      },
    },
  })
  @ApiBody({
    type: SubmitCodeDto,
    required: true,
    examples: {
      submitCode: {
        summary: 'DTO for submitting code',
        description: 'Require all fields',
        value: {
          code: 'const a = [1,2,3];\nfunction temp(b) {\n return b;\n}; \n console.log(temp(a));',
          languageId: 102,
        },
      },
    },
  })
  @Post('/submit')
  async submitCode(@Body() submitCodeDto: SubmitCodeDto, @Res() res) {
    try {
      const codeSubmit =
        await this.userAnswersService.submitCode(submitCodeDto);
      this.logger.debug('Submit code successfully');
      this.response.initResponse(true, 'Submit code successfully', codeSubmit);
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
    summary: 'Get code result by token',
  })
  @ApiResponse({
    status: 200,
    description: 'Get code result successfully',
    schema: {
      example: {
        success: true,
        message: 'Get code result successfully',
        data: {
          stdout: 'WyAxLCAyLCAzIF0K',
          status: {
            id: 3,
            description: 'Accepted',
          },
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
        message: 'System error while getting code result',
        data: null,
      },
    },
  })
  @ApiBody({
    type: SubmitCodeDto,
    required: true,
    examples: {
      submitCode: {
        summary: 'DTO for submitting code',
        description: 'Require all fields',
        value: {
          code: 'const a = [1,2,3];\nfunction temp(b) {\n return b;\n}; \n console.log(temp(a));',
          languageId: 102,
        },
      },
    },
  })
  @Get('/code-result/:token')
  async getCodeResult(@Param('token') token: string, @Res() res) {
    try {
      const result = await this.userAnswersService.getCodeResult(token);
      this.logger.debug('Get code result successfully');
      this.response.initResponse(true, 'Get code result successfully', result);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while getting code result', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while getting code result',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find user_answer by criterias',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding user_answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding user_answer successfully',
        data: [
          {
            id: 78,
            test_assignment_id: 46,
            question_id: 96,
            answer_text: 'hi',
            score: 10,
          },
          {
            id: 79,
            test_assignment_id: 62,
            question_id: 118,
            answer_text:
              'var main = function(tasks, workers, pills, strength) {\n    tasks.sort((a, b) => a - b);\n    workers.sort((a, b) => a - b);\n\n    function canAssign(mid) {\n        let boosted = [];\n        let w = workers.length - 1;\n        let freePills = pills;\n\n        for (let t = mid - 1; t >= 0; t--) {\n            const task = tasks[t];\n\n            if (boosted.length && boosted[0] >= task) {\n                boosted.shift();\n            } else if (w >= 0 && workers[w] >= task) {\n                w--;\n            } else {\n                while (w >= 0 && workers[w] + strength >= task) {\n                    boosted.push(workers[w--]);\n                }\n                if (!boosted.length || freePills === 0) return false;\n                boosted.pop();\n                freePills--;\n            }\n        }\n\n        return true;\n    }\n\n    let low = 0, high = Math.min(tasks.length, workers.length);\n    while (low < high) {\n        let mid = Math.floor((low + high + 1) / 2);\n        if (canAssign(mid)) low = mid;\n        else high = mid - 1;\n    }\n    return low;\n};',
            score: 20,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalit input data',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        data: [
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
        message: 'System error while finding user_answer',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindUserAnswersCriteriaDto,
    required: true,
    examples: {
      critetias: {
        summary: 'Find user_ansers by criterias',
        description: 'All fields are optional',
        value: {
          id: 1,
          test_assignment_id: 1,
          question_id: 1,
          answer_text: 'main()',
          score: 5,
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
    summary: 'Find all user_answers',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all user_answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all user_answer successfully',
        data: [
          {
            id: 78,
            test_assignment_id: 46,
            question_id: 96,
            answer_text: 'hi',
            score: 10,
          },
          {
            id: 79,
            test_assignment_id: 62,
            question_id: 118,
            answer_text:
              'var main = function(tasks, workers, pills, strength) {\n    tasks.sort((a, b) => a - b);\n    workers.sort((a, b) => a - b);\n\n    function canAssign(mid) {\n        let boosted = [];\n        let w = workers.length - 1;\n        let freePills = pills;\n\n        for (let t = mid - 1; t >= 0; t--) {\n            const task = tasks[t];\n\n            if (boosted.length && boosted[0] >= task) {\n                boosted.shift();\n            } else if (w >= 0 && workers[w] >= task) {\n                w--;\n            } else {\n                while (w >= 0 && workers[w] + strength >= task) {\n                    boosted.push(workers[w--]);\n                }\n                if (!boosted.length || freePills === 0) return false;\n                boosted.pop();\n                freePills--;\n            }\n        }\n\n        return true;\n    }\n\n    let low = 0, high = Math.min(tasks.length, workers.length);\n    while (low < high) {\n        let mid = Math.floor((low + high + 1) / 2);\n        if (canAssign(mid)) low = mid;\n        else high = mid - 1;\n    }\n    return low;\n};',
            score: 20,
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
        message: 'Error finding all user_answer',
        data: null,
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
    summary: 'Find user_answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of user_answer to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding user_answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding user_answer successfully',
        data: {
          id: 78,
          test_assignment_id: 46,
          question_id: 96,
          answer_text: 'hi',
          score: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID must be a number',
    schema: {
      example: {
        success: false,
        message: 'ID must be a number',
        data: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while finding user_answer',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
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
        message: 'System error while updating user_answer',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateUserAnswerDto,
    required: true,
    examples: {
      updateDto: {
        summary: 'DTO for updating user_answer',
        description: 'All fields are optional',
        value: {
          test_assignment_id: 46,
          question_id: 96,
          answer_text: 'hi',
          score: 10,
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
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
    summary: 'Delete user_answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of user_answer to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting user_answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting user_answer successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'Error while deleting user_answer',
        data: null,
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
