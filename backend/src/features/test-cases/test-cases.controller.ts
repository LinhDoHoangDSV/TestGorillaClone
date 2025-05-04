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
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('Test Cases')
@Controller('test-cases')
export class TestCasesController {
  constructor(
    private readonly testCasesService: TestCasesService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new testcase',
  })
  @ApiResponse({
    status: 201,
    description: 'Create test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Create test case successfully',
        data: {
          id: 1,
          question_id: 80,
          input: '111',
          expected_output: '1111',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        data: [
          {
            property: 'question_id',
            constraints: 'Attribute question_id must exist',
          },
          {
            property: 'expected_output',
            constraints: 'Attribute expected_output must exist',
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
        message: 'System error while creating test case',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateTestCaseDto,
    required: true,
    examples: {
      createDto: {
        summary: 'Create a new testcase',
        description: 'input is optional',
        value: {
          question_id: 1,
          input: 'string',
          expected_output: 'string',
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

  @ApiOperation({
    summary: 'Find test case by criterias',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding test case successfully',
        data: [
          {
            id: 1,
            question_id: 80,
            input: '111',
            expected_output: '1111',
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
        message: 'System error while finding test case',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindTestCasesDto,
    required: true,
    examples: {
      findDto: {
        summary: 'Find testcases',
        description: 'All fields are optional',
        value: {
          question_id: 1,
          input: 'string',
          expected_output: 'string',
        },
      },
    },
  })
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
    summary: 'Find all testcases',
  })
  @ApiResponse({
    status: 200,
    description: 'Find all test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all test case successfully',
        data: [
          {
            id: 1,
            question_id: 80,
            input: '111',
            expected_output: '1111',
          },
          {
            id: 2,
            question_id: 80,
            input: '222',
            expected_output: '222',
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
        message: 'System error while finding all test case',
        data: null,
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
    summary: 'Find a testcase by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the testcase to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding test case successfully',
        data: {
          id: 2,
          question_id: 80,
          input: '222',
          expected_output: '222',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
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
        message: 'System error while finding test case',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
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
    summary: 'Update a testcase by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the testcase to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating test case successfully',
        data: {
          id: 1,
          question_id: 80,
          input: '111',
          expected_output: '1111',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
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
        message: 'System error while updating test case',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateTestCaseDto,
    required: true,
    examples: {
      updateDto: {
        summary: 'Update an existing testcase',
        description: 'All fields are optional',
        value: {
          question_id: 1,
          input: 'string',
          expected_output: 'string',
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
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
    description: 'ID of the testcase to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting test case successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting test case successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while deleting test case',
        data: null,
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
