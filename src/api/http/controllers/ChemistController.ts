import {
    Authorized, Body, CurrentUser, JsonController, Post, UploadedFile
} from 'routing-controllers';

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
}
