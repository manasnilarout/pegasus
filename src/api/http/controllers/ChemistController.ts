import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams,
    UploadedFile
} from 'routing-controllers';

import ChemistFindRequest from '../../../api/request/ChemistFindRequest';
import FindResponse from '../../../api/response/FindResponse';
import { DefaultFileUploadConfig } from '../../../config';
import { Chemist } from '../../../models/Chemist';
import { User } from '../../../models/User';
import { ChemistService } from '../../../services/ChemistService';
import { File } from '../../request/FileRequest';
import { Chemist as Route } from '../../routes/http';

@JsonController(Route.BASE)
export class ChemistController {
    constructor(
        private chemistService: ChemistService
    ) { }

    @Authorized()
    @Post()
    public async createChemist(
        @CurrentUser() loggedInUser: User,
        @UploadedFile('chemistImage', { options: DefaultFileUploadConfig }) file: File,
        @Body() chemist: Chemist
    ): Promise<Chemist> {
        return await this.chemistService.createChemist(chemist, file, loggedInUser);
    }

    @Authorized()
    @Get()
    public async getChemists(@QueryParams() params: ChemistFindRequest): Promise<FindResponse<Chemist>> {
        return await this.chemistService.getChemists(params);
    }

    @Authorized()
    @Delete(Route.ID)
    public async deleteChemist(@Param('chemistId') chemistId: string): Promise<Chemist> {
        return await this.chemistService.deleteChemist(Number(chemistId));
    }

    @Authorized()
    @Put(Route.ID)
    public async updateChemist(
        @Param('chemistId') chemistId: string,
        @UploadedFile('chemistImage', { options: DefaultFileUploadConfig }) file: File,
        @Body() chemist: Chemist
    ): Promise<Chemist> {
        return await this.chemistService.updateChemist(Number(chemistId), chemist, file);
    }
}
