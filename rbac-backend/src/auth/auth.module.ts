import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({}),
    ],
    providers: [
        AuthService,
        JwtAccessStrategy,
        RefreshStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
