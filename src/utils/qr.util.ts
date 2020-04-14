import { nanoid } from 'nanoid';
import { join } from 'path';
import { QRCodeToFileOptions, toFile } from 'qrcode';

import { config } from '../config';
import { env } from '../env';

export class QRUtil {
    protected qrCodeOptions: QRCodeToFileOptions = {};

    constructor(options?: QRCodeToFileOptions) {
        this.qrCodeOptions.type = options.type || 'png';
        this.qrCodeOptions.margin = 1;
        this.qrCodeOptions.scale = options.scale || 2;
        this.qrCodeOptions.version = options.version || undefined;
        this.qrCodeOptions.errorCorrectionLevel = options.errorCorrectionLevel || 'L';
    }

    public async generateQR(data: string, outputPath?: string, options?: QRCodeToFileOptions): Promise<string> {

        if (!outputPath) {
            outputPath = this.getDefaultFileName();
        }

        await toFile(outputPath, data, options || this.qrCodeOptions);
        return outputPath;
    }

    private getDefaultFileName(): string {
        const defaultFileName = `${new Date().getTime()}-${nanoid(8)}.png`;
        return join(env.app.dirs.tempDir, config.get('dirs.tmp.qr'), defaultFileName);
    }
}
