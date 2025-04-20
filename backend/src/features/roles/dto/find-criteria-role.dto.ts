import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class FindRolesCriteriasDto extends PartialType(CreateRoleDto) {}
