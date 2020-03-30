import { diskStorage, Options } from 'multer';
import { extname } from 'path';

import { env } from '../env';
import { config } from './';

export const FileUploadConfig: Options = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(undefined, env.app.dirs.tempDir + config.get('dirs.upload'));
        },
        filename: (req, file, cb) => {
            const extension = extname(file.originalname);
            cb(undefined, `${file.fieldname}-${new Date().getTime()}${extension}`);
        },
    }),
    limits: {
        fieldNameSize: config.get('uploadFileConfig.maxFieldNameSize'),
        fileSize: 1024 * 1024 * config.get('uploadFileConfig.maxFileSizeInMB'),
    },
    preservePath: true,
};
