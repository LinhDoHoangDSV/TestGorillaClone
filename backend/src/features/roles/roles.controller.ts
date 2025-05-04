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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { LoggerService } from '../logger/logger.service';
import { Response } from '../response/response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindRolesCriteriasDto } from './dto/find-criteria-role.dto';
import { ValidationIDPipe } from 'src/common/pipe/validation-id.pipe';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
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
    description: 'Invalid input data',
    schema: {
      example: {
        success: false,
        message: 'Invalid input data',
        data: [
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
        message: 'System error while creating role',
        data: null,
      },
    },
  })
  @ApiBody({
    type: CreateRoleDto,
    required: true,
    examples: {
      createDto: {
        summary: 'DTO for creating a new role',
        description: 'description is optional',
        value: {
          name: 'HR',
          description: 'Some one called HR',
        },
      },
    },
  })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res) {
    try {
      const newRole = await this.rolesService.create(createRoleDto);
      this.logger.debug('Creating role successfully');
      this.response.initResponse(true, 'Creating role successfully', newRole);
      return res.status(HttpStatus.CREATED).json(this.response);
    } catch (error) {
      this.logger.error('Error while creating role', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while creating role',
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
    status: 500,
    description: 'System error',
    schema: {
      example: {
        success: false,
        message: 'System error while finding roles',
        data: null,
      },
    },
  })
  @ApiBody({
    type: FindRolesCriteriasDto,
    required: true,
    examples: {
      user_1: {
        summary: 'DTO for finding roles by criteria',
        description: 'All fields are optional',
        value: {
          name: 'HR',
          description: 'Some one called HR',
        },
      },
    },
  })
  @Post('/criterias')
  async findByCriterias(
    @Body() findRolesCriteriasDto: FindRolesCriteriasDto,
    @Res() res,
  ) {
    try {
      const existingAnswers = await this.rolesService.findByCriterias(
        findRolesCriteriasDto,
      );
      this.logger.debug('Finding roles successfully');
      this.response.initResponse(
        true,
        'Finding roles successfully',
        existingAnswers,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding roles', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding roles',
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
        message: 'System error while finding all roles',
        data: null,
      },
    },
  })
  @Get()
  async findAll(@Res() res) {
    try {
      const roles = await this.rolesService.findAll();
      this.logger.debug('Finding all roles successfully');
      this.response.initResponse(true, 'Finding all roles successfully', roles);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error finding all roles', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding all roles',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }

  @ApiOperation({
    summary: 'Find role by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the role to retrieve',
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
        message: 'System error while finding role',
        data: null,
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id', ValidationIDPipe) id: string, @Res() res) {
    try {
      const role = await this.rolesService.findOne(+id);
      this.logger.debug('Finding role successfully');
      this.response.initResponse(true, 'Finding role successfully', role);
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while finding role', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while finding role',
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
    description: 'ID of the role to be updated',
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
        message: 'System error while updating role',
        data: null,
      },
    },
  })
  @ApiBody({
    type: UpdateRoleDto,
    required: true,
    examples: {
      updateDto: {
        summary: 'DTO for updating an existing role',
        description: 'All fields are optional',
        value: {
          name: 'HR',
          description: 'Some one called HR',
        },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id', ValidationIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res,
  ) {
    try {
      const updatedRole = await this.rolesService.update(+id, updateRoleDto);
      this.logger.debug('Updating role successfully');
      this.response.initResponse(
        true,
        'Updating role successfully',
        updatedRole,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while updating role', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while updating role',
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
        message: 'System error while deleting role',
        data: null,
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deletedRole = await this.rolesService.remove(+id);
      this.logger.debug('Deleting role successfully');
      this.response.initResponse(
        true,
        'Deleting role successfully',
        deletedRole,
      );
      return res.status(HttpStatus.OK).json(this.response);
    } catch (error) {
      this.logger.error('Error while deleting role', error?.stack);
      if (error instanceof HttpException) {
        this.response.initResponse(false, error?.message, null);
        return res.status(error?.getStatus()).json(this.response);
      } else {
        this.response.initResponse(
          false,
          'System error while deleting role',
          null,
        );
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.response);
      }
    }
  }
}
