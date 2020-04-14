import {
    Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put, QueryParams
} from 'routing-controllers';

import { Attachments } from '../../../models/Attachments';
import { QrPoints } from '../../../models/QrPoints';
import { User } from '../../../models/User';
import { QRService } from '../../../services/QRService';
import QrPointsFindRequest from '../../request/QrPointsFindRequest';
import FindResponse from '../../response/FindResponse';
import { QR as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class QRController {
    constructor(
        private qrService: QRService
    ) { }

    @Authorized()
    @Post()
    public async createQrs(@Body() qr: QrPoints, @CurrentUser() user: User): Promise<QrPoints[]> {
        return await this.qrService.createQrs(qr, user);
    }

    @Authorized()
    @Get()
    public async getQrPoints(@QueryParams() params: QrPointsFindRequest): Promise<FindResponse<QrPoints>> {
        return await this.qrService.getQrs(params);
    }

    @Authorized()
    @Put(Route.ID)
    public async editQr(
        @Param('batchNumber') batchNumber: string,
        @Param('batchQuantity') batchQuantity: number,
        @Body() qr: QrPoints
    ): Promise<QrPoints[]> {
        return await this.qrService.editQr(batchNumber, batchQuantity, qr);
    }

    @Authorized()
    @Get(Route.DOWNLOAD)
    public async downloadQr(@Param('id') id: string): Promise<Attachments> {
        return await this.qrService.downloadQr(id);
    }
}
