import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RequestUser } from '../../common/interfaces/auth-user.interface';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface LoginResponse {
  token: string;
  user: RequestUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.findByEmailForLogin(dto.email);

    if (!user || user.status !== 'active' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.usersService.markActive(user._id.toString());

    const authUser = this.usersService.toAuthUser(user);
    const payload: JwtPayload = {
      sub: authUser.id,
      email: authUser.email,
      role: authUser.role,
      branchId: authUser.branchId,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: authUser,
    };
  }
}
