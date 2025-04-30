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
  UseGuards,
  Req,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FindStatisticCriteriaDto } from './dto/find-statistic-criteria.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { RequestWithUserDto, Roles } from 'src/common/constant';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
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
    type: CreateStatisticDto,
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
  async create(@Body() createStatisticDto: CreateStatisticDto, @Res() res) {
    try {
      const newStatistic =
        await this.statisticsService.create(createStatisticDto);
      this.logger.debug('Creating statistic successfully');
      this.response.initResponse(
        true,
        'Creating statistic successfully',
        newStatistic,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating statistic', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating statistic',
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
    type: FindStatisticCriteriaDto,
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
    @Body() findStatisticCriteriaDto: FindStatisticCriteriaDto,
    @Res() res,
  ) {
    try {
      const existingStatistic = await this.statisticsService.findByCriterias(
        findStatisticCriteriaDto,
      );
      this.logger.debug('Finding statistics successfully');
      this.response.initResponse(
        true,
        'Finding statistics successfully',
        existingStatistic,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding statistics', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding statistics',
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
      const statistics = await this.statisticsService.findAll();
      this.logger.debug('Finding all statistics successfully');
      this.response.initResponse(
        true,
        'Finding all statistics successfully',
        statistics,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all statistics', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all statistics',
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
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Res() res, @Param('id') id: string) {
    try {
      const statistic = await this.statisticsService.findOne(+id);
      this.logger.debug('Finding statistic successfully');
      this.response.initResponse(
        true,
        'Finding statistic successfully',
        statistic,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding statistic', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding statistic',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Get('/one/own')
  async findOneByUser(@Res() res, @Req() request: RequestWithUserDto) {
    const { user } = request;
    try {
      const [statistic] = await this.statisticsService.findByCriterias({
        user_id: user?.userId,
      });
      this.logger.debug('Finding statistic successfully');
      this.response.initResponse(
        true,
        'Finding statistic successfully',
        statistic,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding statistic', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding statistic',
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
    type: UpdateStatisticDto,
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
    @Body() updateStatisticDto: UpdateStatisticDto,
    @Res() res,
  ) {
    try {
      const updatedStatistic = await this.statisticsService.update(
        +id,
        updateStatisticDto,
      );
      this.logger.debug('Updating statistic successfully');
      this.response.initResponse(
        true,
        'Updating statistic successfully',
        updatedStatistic,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating statistic', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating statistic',
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
      const deletedStatistic = await this.statisticsService.remove(+id);
      this.logger.debug('Deleting statistic successfully');
      this.response.initResponse(
        true,
        'Deleting statistic successfully',
        deletedStatistic,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting statistic', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting statistic',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
