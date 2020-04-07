import { nanoid } from 'nanoid';
import { EntityRepository, Repository } from 'typeorm';

import { Attachments } from '../models/Attachments';

@EntityRepository(Attachments)
export class AttachmentsRepository extends Repository<Attachments>  {
    public async createAttachment(filePath: string, fileName?: string): Promise<Attachments> {
        const attachment = new Attachments();
        attachment.attachmentName = fileName || nanoid(8);
        attachment.fileLocation = filePath;
        return await this.save(attachment);
    }
 }
