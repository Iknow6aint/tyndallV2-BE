import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../interfaces/auth-user.interface';

interface RequestWithUser {
  user?: RequestUser;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user as RequestUser;
  },
);
