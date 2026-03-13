import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
declare const RefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshStrategy extends RefreshStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(req: Request, payload: any): Promise<{
        id: string;
        email: string;
        roleId: string;
    }>;
}
export {};
