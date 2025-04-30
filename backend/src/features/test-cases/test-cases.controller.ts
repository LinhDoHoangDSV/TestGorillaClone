import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TestCasesService } from './test-cases.service';
import { CreateTestCaseDto } from './dto/create-test-case.dto';
import { UpdateTestCaseDto } from './dto/update-test-case.dto';
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
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { Roles } from 'src/common/constant';
import { FindTestCasesDto } from './dto/find-test-case.dto';

@ApiTags('Test-Cases')
@Controller('test-cases')
export class TestCasesController {
  constructor(
    private readonly testCasesService: TestCasesService,
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
    type: CreateTestCaseDto,
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
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createTestCaseDto: CreateTestCaseDto, @Res() res) {
    try {
      const newTestCase = await this.testCasesService.create(createTestCaseDto);
      this.logger.debug('Create test case successfully');
      this.response.initResponse(
        true,
        'Create test case successfully',
        newTestCase,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating test case',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @Post('/criterias')
  async findByCriterias(
    @Body() findTestCasesDto: FindTestCasesDto,
    @Res() res,
  ) {
    try {
      const existingTestCase =
        await this.testCasesService.findByCriterias(findTestCasesDto);
      this.logger.debug('Finding test case successfully');
      this.response.initResponse(
        true,
        'Finding test case successfully',
        existingTestCase,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding test case',
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
      const testCases = await this.testCasesService.findAll();
      this.logger.debug('Find all test case successfully');
      this.response.initResponse(
        true,
        'Finding all test case successfully',
        testCases,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all test case',
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
      const testCase = await this.testCasesService.findOne(+id);
      this.logger.debug('Finding test case successfully');
      this.response.initResponse(
        true,
        'Finding test case successfully',
        testCase,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding test case',
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
    type: UpdateTestCaseDto,
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
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestCaseDto: UpdateTestCaseDto,
    @Res() res,
  ) {
    try {
      const updatedTestCase = await this.testCasesService.update(
        +id,
        updateTestCaseDto,
      );
      this.logger.debug('Updating test case successfully');
      this.response.initResponse(
        true,
        'Updating test case successfully',
        updatedTestCase,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating test case',
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
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedTestCase = await this.testCasesService.remove(+id);
      this.logger.debug('Deleting test case successfully');
      this.response.initResponse(
        true,
        'Deleting test case successfully',
        deletedTestCase,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting test case', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting test case',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
