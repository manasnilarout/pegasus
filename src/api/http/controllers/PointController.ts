import {
    Authorized, CurrentUser, Get, JsonController, Param, Post, QueryParam, QueryParams
} from 'routing-controllers';

import { ChemistQrPoint } from '../../../models/ChemistQrPoint';
import { ChemistRedemptions } from '../../../models/ChemistRedemptions';
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
    @Get(Route.REDEEM_POINTS)
    public async redeemPoints(
        @Param('chemistId') chemistId: string,
        @QueryParam('points') points: number,
        @CurrentUser() user: User
    ): Promise<ChemistRedemptions> {
        return await this.pointService.redeemPoints(chemistId, points, user);
    }
}
