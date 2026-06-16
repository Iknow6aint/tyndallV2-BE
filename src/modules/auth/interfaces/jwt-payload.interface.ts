import { AuthRole } from '../../../common/interfaces/auth-user.interface';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AuthRole;
  branchId: string | null;
}
