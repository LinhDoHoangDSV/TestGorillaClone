import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TestAssignmentService } from './test-assignment.service';
import { CreateTestAssignmentDto } from './dto/create-test-assignment.dto';
import { UpdateTestAssignmentDto } from './dto/update-test-assignment.dto';
import { TestsService } from '../tests/tests.service';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FindTestAssignmentCriteriaDto } from './dto/find-test-assignment-criteria.dto';
import { InviteTestDto } from './dto/invite-test.dto';
import { SendRequestDto } from '../mail-service/dto/send-request.dto';
import { MailService } from '../mail-service/mail-service.service';
import { AdjustScoreDto } from './dto/adjust-score.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import {
  RequestWithUserDto,
  Roles,
  TestAssignmentStatus,
} from 'src/common/constant';
import { StatisticsService } from '../statistics/statistics.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ConfigService } from '@nestjs/config';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@Controller('test-assignment')
export class TestAssignmentController {
  constructor(
    private readonly testAssignmentService: TestAssignmentService,
    private readonly testsService: TestsService,
    private readonly mailService: MailService,
    private readonly statisticsService: StatisticsService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new test assignment',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating test_assignment successfully',
        data: {
          id: 46,
          test_id: 38,
          candidate_email: 'linhdh@dgroup.co',
          expired_invitation: null,
          started_at: '2025-04-29T13:42:31.271Z',
          is_online: true,
          score: 20,
          code: '579446',
          status: 'completed',
          count_exit: 0,
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
            property: 'test_id',
            constraints: 'Attribute test_id must exist',
          },
          {
            property: 'candidate_email',
            constraints: 'Attribute candidate_email must exist',
          },
          {
            property: 'code',
            constraints: 'Attribute code must exist',
          },
          {
            property: 'status',
            constraints: 'Attribute status must exist',
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
        message: 'System error while creating assignment',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateTestAssignmentDto,
    required: true,
    examples: {
      createDto: {
        summary: 'Create a new test-assignment',
        description: 'expired_invitation, started_at, is_online are optional',
        value: {
          test_id: 1,
          candidate_email: 'string',
          expired_invitation: new Date(),
          started_at: new Date(),
          is_online: true,
          score: 1,
          code: 'string',
          status: 'not_started',
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createTestAssignmentDto: CreateTestAssignmentDto,
    @Res() res,
  ) {
    try {
      const existingTest = await this.testsService.findOne(
        createTestAssignmentDto.test_id,
      );

      if (!existingTest) throw new BadRequestException('Test do not exist');

      const newTestAssignment = await this.testAssignmentService.create(
        createTestAssignmentDto,
      );
      this.logger.debug('Creating test_assignment successfully');
      this.response.initResponse(
        true,
        'Creating test_assignment successfully',
        newTestAssignment,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find test-assignment by criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding test_assignment successfully',
        data: [
          {
            id: 46,
            test_id: 38,
            candidate_email: 'linhdh@dgroup.co',
            expired_invitation: null,
            started_at: '2025-04-29T13:42:31.271Z',
            is_online: true,
            score: 20,
            code: '579446',
            status: 'completed',
            count_exit: 0,
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
        message: 'System error while finding test_assignment',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindTestAssignmentCriteriaDto,
    required: true,
    examples: {
      findDto: {
        summary: 'Find test-assignment by criterias',
        description: 'All fields are optional',
        value: {
          test_id: 1,
          candidate_email: 'string',
          expired_invitation: new Date(),
          started_at: new Date(),
          is_online: true,
          score: 1,
          code: 'string',
          status: 'not_started',
        },
      },
    },
  })
  @Post('/criterias')
  async findByCriterias(
    @Body() findTestAssignmentCriteriaDto: FindTestAssignmentCriteriaDto,
    @Res() res,
  ) {
    try {
      const existingTestAssignment =
        await this.testAssignmentService.findByCriterias(
          findTestAssignmentCriteriaDto,
        );
      this.logger.debug('Finding test_assignment successfully');
      this.response.initResponse(
        true,
        'Finding test_assignment successfully',
        existingTestAssignment,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Invite candidate to take the test',
  })
  @ApiResponse({
    status: 200,
    description: 'Sending requests successfully',
    schema: {
      example: {
        success: true,
        message: 'Sending requests successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while sending requests',
      },
    },
  })
  @ApiBody({
    type: InviteTestDto,
    required: true,
    examples: {
      findDto: {
        summary: 'DTO to invite candidate',
        description: 'emails and test_id are required',
        value: {
          test_id: 1,
          candidate_email: 'string',
          expired_invitation: new Date(),
          started_at: new Date(),
          is_online: true,
          score: 1,
          code: 'string',
          status: 'not_started',
          emails: 'string',
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Post('/invite')
  async inviteTest(
    @Body() inviteTestDto: InviteTestDto,
    @Res() res,
    @Req() request: RequestWithUserDto,
  ) {
    const { user } = request;
    try {
      const existingTest = await this.testsService.findOne(
        inviteTestDto.test_id,
      );

      if (!existingTest) throw new BadRequestException('Do not exist test');
      let countEmail: number = 0;
      const { emails, ...createTestAssignmentDto } = inviteTestDto;

      emails.split(',').map(async (email) => {
        if (email.trim() === '') return;
        countEmail++;
        const code = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, '0');
        const newTestAssignment = await this.testAssignmentService.create({
          ...createTestAssignmentDto,
          candidate_email: email.trim(),
          code,
        });

        const emailRequest: SendRequestDto = {
          code,
          email: email.trim(),
          url: `${this.configService.get<string>(
            'FE_URL',
          )}/assessments/attendance/${newTestAssignment.id * 300003 + 200003}`,
        };

        await this.mailService.requestTest(emailRequest);
      });

      const [existingStatistics] = await this.statisticsService.findByCriterias(
        { user_id: user.userId },
      );

      await this.statisticsService.update(existingStatistics.id, {
        total_invitation: existingStatistics.total_invitation + countEmail,
      });

      this.logger.debug('Sending requests successfully');
      this.response.initResponse(true, 'Sending requests successfully', null);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while sending requests', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while sending requests',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Start test assignment',
  })
  @ApiResponse({
    status: 200,
    description: 'Start assessment successfully',
    schema: {
      example: {
        success: true,
        message: 'Start assessment successfully',
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
        message: 'System error while starting assignment',
      },
    },
  })
  @Get('/start/:id')
  async startTestAssignment(
    @Res() res,
    @Param('id', ValidationIDPipe) id: string,
  ) {
    try {
      const existingTestAssessment =
        await this.testAssignmentService.findOne(+id);

      if (!existingTestAssessment) {
        throw new BadRequestException('Test assessment not found');
      }

      const existingTest = await this.testsService.findOne(
        existingTestAssessment.test_id,
      );

      if (!existingTest) {
        throw new BadRequestException('Test not found');
      }
      const date = new Date();
      date.setMinutes(date.getMinutes() + existingTest?.test_time);

      const job = new CronJob(date, async () => {
        await this.testAssignmentService.update(+id, {
          status: TestAssignmentStatus.COMPLETED,
        });
        const [existingStatistics] =
          await this.statisticsService.findByCriterias({
            user_id: existingTest.owner_id,
          });
        await this.statisticsService.update(existingStatistics.id, {
          total_assess_complete: existingStatistics.total_assess_complete + 1,
        });
      });

      this.schedulerRegistry.addCronJob(`Assessment-${id}`, job);
      job.start();

      this.logger.debug('Start assessment successfully');
      this.response.initResponse(true, 'Start assessment successfully', null);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error starting assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while starting assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Complete test assignment',
  })
  @ApiResponse({
    status: 200,
    description: 'Complete assessment',
    schema: {
      example: {
        success: true,
        message: 'Complete assessment',
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
        message: 'System error while completing assignment',
      },
    },
  })
  @Get('/complete/:id')
  async completeTestAssignment(
    @Res() res,
    @Param('id', ValidationIDPipe) id: string,
  ) {
    try {
      const jobName = `Assessment-${id}`;
      const existingCronJob: CronJob =
        this.schedulerRegistry.getCronJob(jobName);

      if (existingCronJob) {
        existingCronJob.fireOnTick();
        this.schedulerRegistry.deleteCronJob(jobName);
      }

      this.logger.debug('Complete assessment');
      this.response.initResponse(true, 'Complete assessment', null);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error compelting assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while completing assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find all test-assignment',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all test_assignment successfully',
        data: [
          {
            id: 46,
            test_id: 38,
            candidate_email: 'linhdh@dgroup.co',
            expired_invitation: null,
            started_at: '2025-04-29T13:42:31.271Z',
            is_online: true,
            score: 20,
            code: '579446',
            status: 'completed',
            count_exit: 0,
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
        message: 'System error while finding all test_assignment',
        data: null,
      },
    },
  })
  @Get()
  async findAll(@Res() res) {
    try {
      const test_assignment = await this.testAssignmentService.findAll();
      this.logger.debug('Finding all test_assignment successfully');
      this.response.initResponse(
        true,
        'Finding all test_assignment successfully',
        test_assignment,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get test-assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the test-assigment to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding test_assignment successfully',
        data: {
          id: 46,
          test_id: 38,
          candidate_email: 'linhdh@dgroup.co',
          expired_invitation: null,
          started_at: '2025-04-29T13:42:31.271Z',
          is_online: true,
          score: 20,
          code: '579446',
          status: 'completed',
          count_exit: 0,
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
        message: 'System error while finding test_assignment',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
    try {
      const test_assignment = await this.testAssignmentService.findOne(+id);
      this.logger.debug('Finding test_assignment successfully');
      this.response.initResponse(
        true,
        'Finding test_assignment successfully',
        test_assignment,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update test-assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the role to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating test_assignment successfully',
        data: {
          id: 46,
          test_id: 38,
          candidate_email: 'linhdh@dgroup.co',
          expired_invitation: null,
          started_at: '2025-04-29T13:42:31.271Z',
          is_online: true,
          score: 20,
          code: '579446',
          status: 'completed',
          count_exit: 0,
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
        message: 'System error while updating test_assignment',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateTestAssignmentDto,
    required: true,
    examples: {
      user_1: {
        summary: 'DTO to update test-assignment',
        description: 'All fields are optional',
        value: {
          test_id: 1,
          candidate_email: 'string',
          expired_invitation: new Date(),
          started_at: new Date(),
          is_online: true,
          score: 1,
          code: 'string',
          status: 'not_started',
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestAssignmentDto: UpdateTestAssignmentDto,
    @Res() res,
  ) {
    try {
      const updatedRole = await this.testAssignmentService.update(
        +id,
        updateTestAssignmentDto,
      );
      this.logger.debug('Updating test_assignment successfully');
      this.response.initResponse(
        true,
        'Updating test_assignment successfully',
        updatedRole,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Adjust score of test-assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the role to be adjusted score',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating test_assignment successfully',
        data: {
          id: 46,
          test_id: 38,
          candidate_email: 'linhdh@dgroup.co',
          expired_invitation: null,
          started_at: '2025-04-29T13:42:31.271Z',
          is_online: true,
          score: 20,
          code: '579446',
          status: 'completed',
          count_exit: 0,
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
        message: 'System error while updating test_assignment',
        data: null,
      },
    },
  })
  @ApiBody({
    type: AdjustScoreDto,
    required: true,
    examples: {
      adjustDto: {
        summary: 'DTO to adjust score for test-assignment',
        description: 'score is required',
        value: {
          score: 1,
        },
      },
    },
  })
  @Patch('/score-adjustment/:id')
  async adjustScore(
    @Param('id', ValidationIDPipe) id: string,
    @Body() adjustScoreDto: AdjustScoreDto,
    @Res() res,
  ) {
    try {
      const existingTestAssignment =
        await this.testAssignmentService.findOne(+id);

      if (!existingTestAssignment)
        throw new BadRequestException('No test assignment exist');
      const newScore = existingTestAssignment.score + adjustScoreDto.score;
      const updatedTestAssignment = await this.testAssignmentService.update(
        +id,
        { score: newScore },
      );
      this.logger.debug('Updating test_assignment successfully');
      this.response.initResponse(
        true,
        'Updating test_assignment successfully',
        updatedTestAssignment,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete test-assignment by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the test-assignment to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting test_assignment successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting test_assignment successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while deleting test_assignment',
        data: null,
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedTestAssignment =
        await this.testAssignmentService.remove(+id);
      this.logger.debug('Deleting test_assignment successfully');
      this.response.initResponse(
        true,
        'Deleting test_assignment successfully',
        deletedTestAssignment,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting test_assignment', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting test_assignment',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
