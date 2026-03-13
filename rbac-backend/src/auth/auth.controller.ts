import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshGuard } from './guards/refresh.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        const { accessToken, refreshToken, user } = await this.authService.login(loginDto);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return { accessToken, user };
    }

    @UseGuards(RefreshGuard)
    @Post('refresh')
    async refresh(@Req() req: any) {
        return this.authService.generateTokens(req.user.id, req.user.email, req.user.roleId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: express.Response) {
        const refreshToken = req.cookies?.['refreshToken'];
        await this.authService.logout(req.user.id, refreshToken);
        res.clearCookie('refreshToken');
        return { message: 'Logged out' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }
}
