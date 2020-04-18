import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams
} from 'routing-controllers';

import { HqQrPoints } from '../../../models/HqQrPoints';
import { User } from '../../../models/User';
import { HqQrService } from '../../../services/HqQrService';
import HqQrPointsFindRequest from '../../request/HqQrPointsFindRequest';
import FindResponse from '../../response/FindResponse';
import { HqQr as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class HqQrController {
    constructor(
        private hqQrService: HqQrService
    ) { }

    @Authorized()
    @Post()
    public async createHqQr(@Body() hqQr: HqQrPoints, @CurrentUser() currentUser: User): Promise<HqQrPoints> {
        return await this.hqQrService.createHqQr(hqQr, currentUser);
    }

    @Authorized()
    @Put(Route.ID)
    public async editHhqQr(@Param('hqQrId') hqQrId: string, @Body() hqQr: HqQrPoints): Promise<HqQrPoints> {
        return await this.hqQrService.editHhqQr(Number(hqQrId), hqQr);
    }

    @Authorized()
    @Get()
    public async getHqQrs(@QueryParams() params: HqQrPointsFindRequest): Promise<FindResponse<HqQrPoints>> {
        return await this.hqQrService.getHqQrs(params);
    }

    @Authorized()
    @Delete(Route.ID)
    public async deleteHqQr(@Param('hqQrId') hqQrId: string): Promise<HqQrPoints> {
        return await this.hqQrService.deleteHqQr(Number(hqQrId));
    }
}
