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
import { InitialCodesService } from './initial-codes.service';
import { CreateInitialCodeDto } from './dto/create-initial-code.dto';
import { UpdateInitialCodeDto } from './dto/update-initial-code.dto';
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
import RoleGuard from 'src/common/guard/role.guard';
import { Roles } from 'src/common/constant';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import { FindInitialCodeDto } from './dto/find-initial-code.dto';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('Initial Codes')
@Controller('initial-codes')
export class InitialCodesController {
  constructor(
    private readonly initialCodesService: InitialCodesService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new initial code',
  })
  @ApiResponse({
    status: 201,
    description: 'Create initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Create initial code successfully',
        data: {
          id: 3,
          question_id: 92,
          language_id: 102,
          description: '',
          initial_code:
            'function main() {\n   const a = 10;\n   console.log(a);\n}',
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
            property: 'language_id',
            constraints: 'Attribute language_id must exist',
          },
          {
            property: 'initial_code',
            constraints: 'Attribute initial_code must exist',
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
        message: 'System error while creating initial code',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateInitialCodeDto,
    examples: {
      createDto: {
        summary: 'DTO for creating a new initial code',
        description: 'description is optional',
        value: {
          question_id: 1,
          language_id: 1,
          description: 'string',
          initial_code: 'string',
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createInitialCodeDto: CreateInitialCodeDto, @Res() res) {
    try {
      const newInitialCode =
        await this.initialCodesService.create(createInitialCodeDto);
      this.logger.debug('Create initial code successfully');
      this.response.initResponse(
        true,
        'Create initial code successfully',
        newInitialCode,
      );
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find initial code by criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding initial code successfully',
        data: [
          {
            id: 3,
            question_id: 92,
            language_id: 102,
            description: '',
            initial_code:
              'function main() {\n   const a = 10;\n   console.log(a);\n}',
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
        message: 'System error while finding initial code',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindInitialCodeDto,
    required: true,
    examples: {
      createDto: {
        summary: 'DTO for finding a new initial code',
        description: 'All fields are optional',
        value: {
          question_id: 1,
          language_id: 1,
          description: 'string',
          initial_code: 'string',
        },
      },
    },
  })
  @Post('/criterias')
  async findByCriterias(
    @Body() findInitialCodeDto: FindInitialCodeDto,
    @Res() res,
  ) {
    try {
      const existingInitialCode =
        await this.initialCodesService.findByCriterias(findInitialCodeDto);
      this.logger.debug('Finding initial code successfully');
      this.response.initResponse(
        true,
        'Finding initial code successfully',
        existingInitialCode,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find all initial codes',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all initial code successfully',
        data: [
          {
            id: 1,
            question_id: 80,
            language_id: 102,
            description: '',
            initial_code:
              'function main() {\n  const a = 10;\n  const b = 100;\n}',
          },
          {
            id: 2,
            question_id: 91,
            language_id: 102,
            description: '',
            initial_code:
              'function main() {\n  const a = 10;\n  const b = 100;\n}',
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
        message: 'System error while finding all initial code',
        data: null,
      },
    },
  })
  @Get()
  async findAll(@Res() res) {
    try {
      const initialCodes = await this.initialCodesService.findAll();
      this.logger.debug('Find all initial code successfully');
      this.response.initResponse(
        true,
        'Finding all initial code successfully',
        initialCodes,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find a initial code by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the initial code to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding initial code successfully',
        data: {
          id: 2,
          question_id: 91,
          language_id: 102,
          description: '',
          initial_code:
            'function main() {\n  const a = 10;\n  const b = 100;\n}',
        },
      },
    },
  })
  @ApiBadRequestResponse({
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
        message: 'System error while finding initial code',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
    try {
      const initialCodes = await this.initialCodesService.findOne(+id);
      this.logger.debug('Finding initial code successfully');
      this.response.initResponse(
        true,
        'Finding initial code successfully',
        initialCodes,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update a initial code by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the initial code to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating initial code successfully',
        data: {
          id: 2,
          question_id: 91,
          language_id: 102,
          description: '',
          initial_code:
            'function main() {\n  const a = 10;\n  const b = 100;\n}',
        },
      },
    },
  })
  @ApiBadRequestResponse({
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
        message: 'System error while updating initial code',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateInitialCodeDto,
    required: true,
    examples: {
      updateDto: {
        summary: 'DTO for updating an existing initial code',
        description: 'All fields are optional',
        value: {
          question_id: 1,
          language_id: 1,
          description: 'string',
          initial_code: 'string',
        },
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
    @Body() updateInitialCodeDto: UpdateInitialCodeDto,
    @Res() res,
  ) {
    try {
      const updatedInitialCode = await this.initialCodesService.update(
        +id,
        updateInitialCodeDto,
      );
      this.logger.debug('Updating initial code successfully');
      this.response.initResponse(
        true,
        'Updating initial code successfully',
        updatedInitialCode,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete an initial code by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the initial code to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting initial code successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting initial code successfully',
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
        message: 'System error while deleting initial code',
        data: null,
      },
    },
  })
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedInitialCode = await this.initialCodesService.remove(+id);
      this.logger.debug('Deleting initial code successfully');
      this.response.initResponse(
        true,
        'Deleting initial code successfully',
        deletedInitialCode,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting initial code', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting initial code',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
