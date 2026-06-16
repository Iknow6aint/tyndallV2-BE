import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Sign in to the dashboard' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'JWT and frontend-compatible authenticated user payload.',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('logout')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Sign out of the dashboard' })
  @ApiOkResponse({
    description: 'Logout acknowledged. JWT invalidation is stateless for now.',
    schema: {
      example: { ok: true },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  logout(): { ok: true } {
    return { ok: true };
  }
}
