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
import { AdjustExitDto } from './dto/adjust-exit-count.dto';

@Controller('test-assignment')
export class TestAssignmentController {
  constructor(
    private readonly testAssignmentService: TestAssignmentService,
    private readonly testsService: TestsService,
    private readonly mailService: MailService,
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
    type: CreateTestAssignmentDto,
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
        'Creating assignment successfully',
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
    type: FindTestAssignmentCriteriaDto,
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

  @Post('/invite')
  async inviteTest(@Body() inviteTestDto: InviteTestDto, @Res() res) {
    try {
      const existingTest = await this.testsService.findOne(
        inviteTestDto.test_id,
      );

      if (!existingTest) throw new BadRequestException('Do not exist test');

      const { emails, ...createTestAssignmentDto } = inviteTestDto;

      emails.split(',').map(async (email) => {
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
          url: `http://localhost:3000/assessments/attendance/${newTestAssignment.id * 300003 + 200003}`,
        };

        await this.mailService.requestTest(emailRequest);
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
    type: UpdateTestAssignmentDto,
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

  @Patch('/score-adjustment/:id')
  async adjustScore(
    @Param('id') id: string,
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

  @Patch('/exit-adjustment/:id')
  async adjustExitCount(
    @Body() adjustCountExitDto: AdjustExitDto,
    @Param('id') id: string,
    @Res() res,
  ) {
    try {
      const existingTestAssignment =
        await this.testAssignmentService.findOne(+id);

      if (!existingTestAssignment)
        throw new BadRequestException('No test assignment exist');

      const newExitCount =
        existingTestAssignment.count_exit + adjustCountExitDto.count_exit;
      const updatedTestAssignment = await this.testAssignmentService.update(
        +id,
        { count_exit: newExitCount },
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
