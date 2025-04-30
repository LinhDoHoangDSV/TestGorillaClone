import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { RequestWithUserDto, Roles } from '../constant';

const RoleGuard = (role: string): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUserDto>();
      const { user } = request;

      const listRole = {
        [Roles.HR]: 1,
        [Roles.ADMIN]: 2,
      };

      return listRole[user.role] >= listRole[role];
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
