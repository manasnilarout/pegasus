import {
    Authorized, CurrentUser, Get, JsonController, Param, Post, QueryParam, QueryParams
} from 'routing-controllers';

import { ChemistQrPoint } from '../../../models/ChemistQrPoint';
import { ChemistRedemptions } from '../../../models/ChemistRedemptions';
import { Otp } from '../../../models/Otp';
import { User } from '../../../models/User';
import { PointService } from '../../../services/PointService';
import ChemistQrPointFindRequest from '../../request/ChemistQrPointFindRequest';
import ChemistRedemptionFindRequest from '../../request/ChemistRedemptionFindRequest';
import FindResponse from '../../response/FindResponse';
import { Point as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class PointController {
    constructor(
        private pointService: PointService
    ) { }

    @Authorized()
    @Get()
    public async getPoints(@QueryParams() chemistQrPointFindRequest: ChemistQrPointFindRequest): Promise<FindResponse<ChemistQrPoint>> {
        return await this.pointService.getPoints(chemistQrPointFindRequest);
    }

    @Authorized()
    @Get(Route.REDEMPTION)
    public async getRedemptions(@QueryParams() chemistRedemptionFindRequest: ChemistRedemptionFindRequest): Promise<FindResponse<ChemistRedemptions>> {
        return await this.pointService.getRedemptions(chemistRedemptionFindRequest);
    }

    @Authorized()
    @Post(Route.SCAN)
    public async scanQr(
        @Param('chemistId') chemistId: string,
        @Param('qrId') qrId: string,
        @CurrentUser() user: User
    ): Promise<ChemistQrPoint> {
        return this.pointService.scanQr(chemistId, qrId, user);
    }

    @Authorized()
    @Get(Route.REDEEM_QR)
    public async redeemQr(
        @Param('chemistId') chemistId: string,
        @Param('qrId') qrId: string,
        @CurrentUser() user: User
    ): Promise<ChemistRedemptions> {
        return this.pointService.redeemQr(chemistId, qrId, user);
    }

    @Authorized()
    @Post(Route.REDEEM_OTP)
    public async otpForRedemption(@Param('chemistId') chemistId: string): Promise<Otp> {
        return await this.pointService.otpForRedemption(chemistId);
    }

    @Authorized()
    @Get(Route.REDEEM_POINTS)
    public async redeemPoints(
        @Param('chemistId') chemistId: string,
        @QueryParam('points') points: number,
        @QueryParam('otp') otp: string,
        @CurrentUser() user: User
    ): Promise<ChemistRedemptions> {
        return await this.pointService.redeemPoints(chemistId, points, otp, user);
    }

    @Authorized()
    @Get(Route.DASHBOARD)
    public async getDashboardPoints(
        @QueryParam('durationInMonths') durationInMonths: string = '1'
    ): Promise<any> {
        return await this.pointService.getDashboardPoints(Number(durationInMonths));
    }
}
