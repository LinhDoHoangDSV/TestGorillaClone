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
} from '@nestjs/swagger';
import RoleGuard from 'src/common/guard/role.guard';
import { Roles } from 'src/common/constant';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import { FindInitialCodeDto } from './dto/find-initial-code.dto';

@Controller('initial-codes')
export class InitialCodesController {
  constructor(
    private readonly initialCodesService: InitialCodesService,
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
    type: CreateInitialCodeDto,
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
    type: UpdateInitialCodeDto,
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
