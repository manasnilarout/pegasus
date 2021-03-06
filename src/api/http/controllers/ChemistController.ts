import multer from 'multer';
import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam,
    QueryParams, Req, UseBefore
} from 'routing-controllers';

import { DefaultFileUploadConfig } from '../../../config';
import { Chemist } from '../../../models/Chemist';
import { Specialty } from '../../../models/Specialty';
import { User } from '../../../models/User';
import { ChemistService } from '../../../services/ChemistService';
import ChemistFindRequest from '../../request/ChemistFindRequest';
import { ChemistRequest } from '../../request/ChemistRequest';
import FindResponse from '../../response/FindResponse';
import { Chemist as Route } from '../../routes/http';

const multerMethod = multer(DefaultFileUploadConfig);

@JsonController(Route.BASE)
export class ChemistController {
    constructor(
        private chemistService: ChemistService
    ) { }

    @Authorized()
    @Post()
    @UseBefore(multerMethod.fields([{ name: 'shopLicence', maxCount: 1 }, { name: 'shopPhoto', maxCount: 1 }]))
    public async createChemist(
        @CurrentUser() loggedInUser: User,
        @Req() req: any,
        @Body() chemist: ChemistRequest
    ): Promise<Chemist> {
        return await this.chemistService.createChemist(
            chemist,
            req.files.shopLicence[0],
            req.files.shopPhoto[0],
            loggedInUser
        );
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
    @UseBefore(multerMethod.fields([{ name: 'shopLicence', maxCount: 1 }, { name: 'shopPhoto', maxCount: 1 }]))
    public async updateChemist(
        @Param('chemistId') chemistId: string,
        @Req() req: any,
        @Body() chemist: ChemistRequest
    ): Promise<Chemist> {
        return await this.chemistService.updateChemist(
            Number(chemistId),
            chemist,
            req.files.shopLicence ? req.files.shopLicence[0] : undefined,
            req.files.shopPhoto ? req.files.shopPhoto[0] : undefined
        );
    }

    @Authorized()
    @Get(Route.ORDERS)
    public async getChemistOrders(
        @Param('chemistId') chemistId: string,
        @QueryParam('periodInMonths') periodInMonths: number
    ): Promise<Chemist> {
        return await this.chemistService.getChemistOrders(Number(chemistId), periodInMonths);
    }

    @Authorized()
    @Get(Route.CLAIMS)
    public async getChemistClaims(
        @Param('chemistId') chemistId: string,
        @QueryParam('periodInMonths') periodInMonths: number
    ): Promise<Chemist> {
        return await this.chemistService.getChemistClaims(Number(chemistId), periodInMonths);
    }

    @Authorized()
    @Get(Route.SPECIALTIES)
    public async getChemistSpecialties(): Promise<Specialty[]> {
        return await this.chemistService.getChemistSpecialties();
    }

    @Authorized()
    @Post(Route.SPECIALTY)
    public async addSpecialty(@Body() specialty: Specialty): Promise<Specialty> {
        return await this.chemistService.addSpecialty(specialty);
    }

    @Authorized()
    @Put(Route.SPECIALTY_ID)
    public async editSpecialty(
        @Param('specialtyId') specialtyId: string,
        @Body() specialty: Specialty
    ): Promise<Specialty> {
        return await this.chemistService.editSpecialty(Number(specialtyId), specialty);
    }
}
