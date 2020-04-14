import { nanoid } from 'nanoid';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { File } from '../api/request/FileRequest';
import { config } from '../config';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { env } from '../env';
import { AttachmentErrorCodes as ErrorCodes } from '../errors/codes';
import { Attachments } from '../models/Attachments';
import { AttachmentsRepository } from '../repositories/AttachmentsRepository';
import { moveFile } from '../utils/file.util';
import { AppService } from './AppService';

@Service()
export class AttachmentService extends AppService {
    constructor(
        @Logger(__filename, config.get('clsNamespace.name')) protected log: LoggerInterface,
        @OrmRepository() private attachmentsRepository: AttachmentsRepository
    ) {
        super();
    }

    public async createAttachment(file: Partial<File>, fileName?: string): Promise<Attachments> {
        try {
            fileName = fileName || nanoid(8);
            const path = await moveFile(file.path, env.app.dirs.attachment, fileName);
            this.log.info('Moved file to attachments directory, attempting create record.');
            return await this.attachmentsRepository.createAttachment(path, fileName);
        } catch (err) {
            const error = this.classifyError(
                err,
                ErrorCodes.attachmentCreationFailed.id,
                ErrorCodes.attachmentCreationFailed.msg,
                { file, fileName }
            );
            error.log(this.log);
            throw error;
        }
    }
}
