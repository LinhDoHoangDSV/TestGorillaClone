import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { FindTestCriteriasDto } from './dto/find-test-criterias.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { RequestWithUserDto, Roles } from 'src/common/constant';
import { StatisticsService } from '../statistics/statistics.service';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('Tests')
@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly statisticsService: StatisticsService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new test',
  })
  @ApiResponse({
    status: 201,
    description: 'Create test successfully',
    schema: {
      example: {
        success: true,
        message: 'Create test successfully',
        data: {
          id: 1,
          owner_id: 5,
          title: 'Fullstack Intern Test',
          description: 'Nothing',
          test_time: 15,
          deleted_at: null,
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
            property: 'test_ime',
            constraints: 'Attribute test_ime is not allowed',
          },
          {
            property: 'test_time',
            constraints: 'Attribute test_time must exist',
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
        message: 'System error while creating test',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateTestDto,
    required: true,
    examples: {
      createDto: {
        summary: 'Create a new question',
        description: 'owner_id, ispublish and deleted_at are optional',
        value: {
          owner_id: 5,
          title: 'Fullstack Intern Test',
          description: 'Nothing',
          test_time: 15,
          is_publish: false,
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createTestDto: CreateTestDto,
    @Res() res,
    @Req() request: RequestWithUserDto,
  ) {
    const { user } = request;
    try {
      const newTest = await this.testsService.create({
        ...createTestDto,
        owner_id: user.userId,
      });
      const [existingStatistics] = await this.statisticsService.findByCriterias(
        { user_id: user.userId },
      );

      await this.statisticsService.update(existingStatistics.id, {
        active_assess: existingStatistics.active_assess + 1,
      });

      this.logger.debug('Create test successfully');
      this.response.initResponse(true, 'Create test successfully', newTest);
      return res.status(201).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating test', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating test',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find all tests created by the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding tests successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all tests successfully',
        data: [
          {
            id: 38,
            owner_id: 4,
            title: 'updated test again',
            description: 'no description',
            test_time: 10,
            deleted_at: null,
            is_publish: true,
          },
          {
            id: 39,
            owner_id: 4,
            title: 'Hope it work well',
            description: 'no des',
            test_time: 10,
            deleted_at: null,
            is_publish: true,
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
        message: 'System error while finding tests',
        data: null,
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Get('/all/own')
  async findAllOwnTests(@Res() res, @Req() request: RequestWithUserDto) {
    const { user } = request;
    try {
      const existingTests = await this.testsService.findByCriterias({
        owner_id: user.userId,
      });
      this.logger.debug('Finding tests successfully');
      this.response.initResponse(
        true,
        'Finding tests successfully',
        existingTests,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding tests', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding tests',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find all tests by criterias',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding tests successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all tests successfully',
        data: [
          {
            id: 38,
            owner_id: 4,
            title: 'updated test again',
            description: 'no description',
            test_time: 10,
            deleted_at: null,
            is_publish: true,
          },
          {
            id: 39,
            owner_id: 4,
            title: 'Hope it work well',
            description: 'no des',
            test_time: 10,
            deleted_at: null,
            is_publish: true,
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
        message: 'System error while finding tests',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindTestCriteriasDto,
    required: true,
    examples: {
      createDto: {
        summary: 'Criteria to find tests',
        description: 'All fields are optional',
        value: {
          owner_id: 5,
          title: 'Fullstack Intern Test',
          description: 'Nothing',
          test_time: 15,
          is_publish: false,
        },
      },
    },
  })
  @Post('/criterias')
  async findByCriterias(
    @Body() findTestByCriteria: FindTestCriteriasDto,
    @Res() res,
  ) {
    try {
      const existingTests =
        await this.testsService.findByCriterias(findTestByCriteria);
      this.logger.debug('Finding tests successfully');
      this.response.initResponse(
        true,
        'Finding tests successfully',
        existingTests,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding tests', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding tests',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find all tests',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all tests successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all tests successfully',
        data: [
          {
            id: 1,
            owner_id: 5,
            title: 'Fullstack Intern Test',
            description: 'Nothing',
            test_time: 15,
            deleted_at: null,
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
        message: 'System error while finding all tests',
        data: null,
      },
    },
  })
  @Get()
  async findAll(@Res() res) {
    try {
      const tests = await this.testsService.findAll();
      this.logger.debug('Finding all tests successfully');
      this.response.initResponse(true, 'Finding all tests successfully', tests);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all tests', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all tests',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find a test by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of test to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding test successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding test successfully',
        data: {
          id: 1,
          owner_id: 5,
          title: 'Fullstack Intern Test',
          description: 'Nothing',
          test_time: 15,
          deleted_at: null,
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
        message: 'System error while finding test',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
    try {
      const test = await this.testsService.findOne(+id);
      this.logger.debug('Finding test successfully');
      this.response.initResponse(true, 'Finding test successfully', test);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding test', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding test',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update a test by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the test to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating test successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating test successfully',
        data: {
          id: 1,
          owner_id: 5,
          title: 'Fullstack Intern Test',
          description: 'Nothing',
          test_time: 15,
          deleted_at: null,
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
        message: 'System error while updating test',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateTestDto,
    required: true,
    examples: {
      user_1: {
        summary: 'Update an existing test',
        description: 'All fields are optional',
        value: {
          owner_id: 1,
          title: 'aba',
          description: 'no description',
          test_time: 100,
          is_publish: true,
          deleted_at: new Date(),
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
    @Body() updateTestDto: UpdateTestDto,
    @Res() res,
  ) {
    try {
      const updatedTest = await this.testsService.update(+id, updateTestDto);
      this.logger.debug('Updating test successfully');
      this.response.initResponse(
        true,
        'Updating test successfully',
        updatedTest,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating test', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating test',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete a test by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the test to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting test successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting test successfully',
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
        message: 'System error while deleting test',
        data: null,
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedTest = await this.testsService.remove(+id);
      this.logger.debug('Deleting test successfully');
      this.response.initResponse(
        true,
        'Deleting test successfully',
        deletedTest,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting test', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting test',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
