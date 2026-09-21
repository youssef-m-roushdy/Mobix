import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterHandler } from '../application/commands/register/register.handler';
import { LoginHandler } from '../application/commands/login/login.handler';
import { RefreshHandler } from '../application/commands/refresh/refresh.handler';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('identity')
@Controller('identity')
export class IdentityController {
  constructor(
    private readonly registerHandler: RegisterHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshHandler: RefreshHandler,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerHandler.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.loginHandler.execute(dto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: any) {
    return this.refreshHandler.execute({
      userId: req.user.userId,
      orgId: req.user.orgId,
      refreshToken: req.user.refreshToken,
    });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async me(@CurrentUser() user: any, @CurrentTenant() orgId: string) {
    return { user, orgId };
  }
}