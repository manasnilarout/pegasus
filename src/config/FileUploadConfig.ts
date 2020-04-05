import { diskStorage, Options } from 'multer';
import { extname } from 'path';

import { env } from '../env';
import { config } from './';

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(undefined, env.app.dirs.tempDir + config.get('dirs.tmp.upload'));
    },
    filename: (req, file, cb) => {
        const extension = extname(file.originalname);
        cb(undefined, `${file.fieldname}-${new Date().getTime()}${extension}`);
    },
});

const limits = {
    fieldNameSize: config.get('uploadFileConfig.maxFieldNameSize'),
    fileSize: 1024 * 1024 * config.get('uploadFileConfig.maxFileSizeInMB'),
};

export const DefaultImageUploadConfig = {
    imageSize: config.get('uploadFileConfig.maxImageSize'),
    getImageOption(): object {
        return {
            options: {
                limit: this.imageSize + 'mb',
            },
        };
    },
};

export const DefaultFileUploadConfig: Options = {
    storage,
    limits,
    preservePath: true,
};
