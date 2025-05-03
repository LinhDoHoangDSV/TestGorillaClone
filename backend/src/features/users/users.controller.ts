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
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindUserCriteriaDto } from './dto/find-user-criteria.dto';
import { RequestWithUserDto, Roles } from 'src/common/constant';
import { AuthGuard } from 'src/common/guard/jwt_auth.guard';
import RoleGuard from 'src/common/guard/role.guard';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
    private readonly response: Response,
  ) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Creating user successfully',
    schema: {
      example: {
        success: true,
        message: 'Creating user successfully',
        data: [
          {
            id: 4,
            role_id: 2,
            email: 'linhdh@dgroup.co',
            first_name: 'Linh',
            last_name: 'Hoang',
            phone_number: '',
            refresh_token: '',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error while creating user',
    schema: {
      example: {
        success: false,
        message: 'System error while creating user',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    examples: {
      user_1: {
        summary: 'Create a new user',
        description:
          'first_name, last_name, phone_number and refresh_token are optional',
        value: {
          role_id: 3,
          email: 'linhdh@dgroup.co',
          first_name: 'Linh',
          last_name: 'Do Hoang',
          phone_number: '',
          refresh_token: '',
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

  // @ApiOperation({
  //   summary: 'Find users by criterias',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Finding users successfully',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Finding users successfully',
  //       data: [
  //         {
  //           id: 4,
  //           role_id: 2,
  //           email: 'linhdh@dgroup.co',
  //           first_name: 'Linh',
  //           last_name: 'Hoang',
  //           phone_number: '0942938128',
  //           refresh_token:
  //             '$2b$10$HpJ7gSCFhLarYA4BxxIgwOgaCHW5SBf.OaLXECR1MSgp0MDgxkFhC',
  //         },
  //       ],
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'System error while finding users',
  //   schema: {
  //     example: {
  //       success: false,
  //       message: 'System error while finding users',
  //       data: null,
  //     },
  //   },
  // })
  // @ApiBody({
  //   type: FindUserCriteriaDto,
  //   required: true,
  //   examples: {
  //     Criterias: {
  //       summary: 'Criterias to find users',
  //       description:
  //         'All fields are optional. You can use any combination of them to find users',
  //       value: {
  //         role_id: 3,
  //         email: 'linhdh@dgroup.co',
  //         first_name: 'Linh',
  //         last_name: 'Do Hoang',
  //         phone_number: '',
  //         refresh_token: '',
  //       },
  //     },
  //   },
  // })
  // @Post('/criterias')
  // async findByCriterias(
  //   @Body() findUserCriteriaDto: FindUserCriteriaDto,
  //   @Res() res,
  // ) {
  //   try {
  //     const existingUsers =
  //       await this.usersService.findByCriterias(findUserCriteriaDto);
  //     this.logger.debug('Finding users successfully');
  //     this.response.initResponse(
  //       true,
  //       'Finding users successfully',
  //       existingUsers,
  //     );
  //     return res.status(HttpStatus.OK).json(this.response);
  //   } catch (error) {
  //     this.logger.error('Error while finding users', error?.stack);
  //     if (error instanceof HttpException) {
  //       this.response.initResponse(false, error?.message, null);
  //       return res.status(error?.getStatus()).json(this.response);
  //     } else {
  //       this.response.initResponse(
  //         false,
  //         'System error while finding users',
  //         null,
  //       );
  //       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
  //     }
  //   }
  // }

  @ApiOperation({
    summary: 'Find all answers',
  })
  @ApiResponse({
    status: 200,
    description: 'Finding all users successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding all users successfully',
        data: [
          {
            id: 4,
            role_id: 2,
            email: 'linhdh@dgroup.co',
            first_name: 'Linh',
            last_name: 'Hoang',
            phone_number: '0942938128',
            refresh_token:
              '$2b$10$HpJ7gSCFhLarYA4BxxIgwOgaCHW5SBf.OaLXECR1MSgp0MDgxkFhC',
          },
          {
            id: 6,
            role_id: 2,
            email: 'plmqaz310304@gmail.com',
            first_name: 'Smalling',
            last_name: 'Harry',
            phone_number: '',
            refresh_token:
              '$2b$10$kg8Vnri4D6SJvDJPblZ7FuBozlztGa7G6xxFcCPpVcgA7GmUCAYJ6',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        message: 'You need to log in to continue',
        data: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        success: false,
        message: 'Forbidden resource',
        data: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'System error while finding all users',
    schema: {
      example: {
        success: false,
        message: 'System error while finding all users',
        data: null,
      },
    },
  })
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Res() res) {
    try {
      const users = await this.usersService.findAll();
      this.logger.debug('Finding all users successfully');
      this.response.initResponse(true, 'Finding all users successfully', users);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding all users', error?.stack);
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
    summary: 'Find an answer by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Finding user successfully',
    schema: {
      example: {
        success: true,
        message: 'Finding user successfully',
        data: {
          id: 4,
          role_id: 2,
          email: 'linhdh@dgroup.co',
          first_name: 'Linh',
          last_name: 'Hoang',
          phone_number: '0942938128',
          refresh_token:
            '$2b$10$HpJ7gSCFhLarYA4BxxIgwOgaCHW5SBf.OaLXECR1MSgp0MDgxkFhC',
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
    description: 'System error while finding user',
    schema: {
      example: {
        success: false,
        message: 'System error while finding user',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
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
    summary: 'Update an user by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to be updated',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Updating user successfully',
    schema: {
      example: {
        success: true,
        message: 'Updating user successfully',
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
  @UseGuards(RoleGuard(Roles.HR))
  @UseGuards(AuthGuard)
  @Patch('update')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
    @Req() request: RequestWithUserDto,
  ) {
    const { user } = request;
    try {
      const updatedUser = await this.usersService.update(
        user.userId,
        updateUserDto,
      );
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
