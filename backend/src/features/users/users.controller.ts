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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FindUserCriteriaDto } from './dto/find-user-criteria.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new answer',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
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
    type: CreateUserDto,
    required: true,
    examples: {
      user_1: {
        summary: 'Create a new answer',
        description: 'Create a new answer',
        value: {
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
        },
      },
    },
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      this.logger.debug('Creating user successfully');
      this.response.initResponse(true, 'Creating user successfully', newUser);
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating user', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating user',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @Post('/criterias')
  async findByCriterias(
    @Body() findUserCriteriaDto: FindUserCriteriaDto,
    @Res() res,
  ) {
    try {
      const existingUser =
        await this.usersService.findByCriterias(findUserCriteriaDto);
      this.logger.debug('Finding users successfully');
      this.response.initResponse(
        true,
        'Finding users successfully',
        existingUser,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding users', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding users',
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
    description: 'Finding all answers successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all answers successfully',
        data: [
          {
            id: 2,
            question_id: 5,
            option_text: 'kjasd',
            is_correct: true,
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
      const users = await this.usersService.findAll();
      this.logger.debug('Finding all users successfully');
      this.response.initResponse(true, 'Finding all users successfully', users);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all users', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all users',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Get an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
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
      const user = await this.usersService.findOne(+id);
      this.logger.debug('Finding user successfully');
      this.response.initResponse(true, 'Finding user successfully', user);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding user', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding user',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Update an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating answer successfully',
        data: {
          id: 2,
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
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
    type: UpdateUserDto,
    required: false,
    examples: {
      user_1: {
        summary: 'Update an existing question',
        description: 'Update an existing question',
        value: {
          question_id: 5,
          option_text: 'kjasd',
          is_correct: true,
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      this.logger.debug('Updating user successfully');
      this.response.initResponse(
        true,
        'Updating user successfully',
        updatedUser,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating user', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating user',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Delete an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the answer to be deleted',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleting answer successfully',
    schema: {
      example: {
        success: true,
        message: 'Deleting answer successfully',
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
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedUser = await this.usersService.remove(+id);
      this.logger.debug('Deleting user successfully');
      this.response.initResponse(
        true,
        'Deleting user successfully',
        deletedUser,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting user', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting user',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
