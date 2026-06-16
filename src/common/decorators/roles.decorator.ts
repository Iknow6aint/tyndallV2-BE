import { SetMetadata } from '@nestjs/common';
import { AuthRole } from '../interfaces/auth-user.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthRole[]) => SetMetadata(ROLES_KEY, roles);
