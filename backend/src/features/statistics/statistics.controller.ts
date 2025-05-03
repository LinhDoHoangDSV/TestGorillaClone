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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindStatisticCriteriaDto } from './dto/find-statistic-criteria.dto';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { RequestWithUserDto, Roles } from 'src/common/constant';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags("'Statistics'")
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new statistic',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating statistic successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating statistic successfully',
        data: {
          id: 4,
          user_id: 5,
          total_invitation: 0,
          active_assess: 1,
          total_assess_complete: 0,
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
            property: 'user_id',
            constraints: 'Attribute user_id must exist',
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
        message: 'System error while creating statistic',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateStatisticDto,
    required: true,
    examples: {
      createDto: {
        summary: 'DTO for creating a new statistic',
        description: 'user_id is required',
        value: {
          user_id: 1,
          total_invitation: 1,
          active_assess: 1,
          total_assess_complete: 1,
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
    summary: 'Find statistics by criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding statistics successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding statistics successfully',
        data: [
          {
            id: 3,
            user_id: 4,
            total_invitation: 27,
            active_assess: 18,
            total_assess_complete: 22,
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
        message: 'System error while finding statistics',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindStatisticCriteriaDto,
    required: true,
    examples: {
      user_1: {
        summary: 'DTO for finding statistics by criteria',
        description: 'All fields are optional',
        value: {
          user_id: 1,
          total_invitation: 1,
          active_assess: 1,
          total_assess_complete: 1,
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
    summary: 'Find all statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all statistics successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all statistics successfully',
        data: [
          {
            id: 3,
            user_id: 4,
            total_invitation: 27,
            active_assess: 18,
            total_assess_complete: 22,
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
        message: 'System error while finding all statistics',
        data: null,
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
    summary: 'Find statistic by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the statistic to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding statistic successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding statistic successfully',
        data: {
          id: 3,
          user_id: 4,
          total_invitation: 27,
          active_assess: 18,
          total_assess_complete: 22,
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
        message: 'System error',
        data: null,
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Res() res, @Param('id', ValidationIDPipe) id: string) {
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

  @ApiOperation({
    summary: 'Find statistics of user',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the statistics to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding statistic successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding statistic successfully',
        data: [
          {
            id: 3,
            user_id: 4,
            total_invitation: 27,
            active_assess: 18,
            total_assess_complete: 22,
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
        message: 'System error while finding statistic',
        data: null,
      },
    },
  })
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
    summary: 'Update statistic by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the statistic to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating statistic successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating statistic successfully',
        data: {
          id: 3,
          user_id: 4,
          total_invitation: 27,
          active_assess: 18,
          total_assess_complete: 22,
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
        message: 'System error while updating statistic',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateStatisticDto,
    required: true,
    examples: {
      user_1: {
        summary: 'DTO for updating a statistic',
        description: 'All fields are optional',
        value: {
          user_id: 1,
          total_invitation: 1,
          active_assess: 1,
          total_assess_complete: 1,
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
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
    summary: 'Delete statistic by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the statistic to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting statistic successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting statistic successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while deleting statistic',
        data: null,
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
