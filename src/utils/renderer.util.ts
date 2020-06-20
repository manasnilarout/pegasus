import { createWriteStream, exists, readFile, WriteStream } from 'fs';
import { create } from 'html-pdf';
import { join } from 'path';
import { compile } from 'pug';
import { Stream } from 'stream';
import { promisify } from 'util';
import { v4 } from 'uuid';

import { config } from '../config';
import { env } from '../env';

export class RendererUtil {

    protected _readFileAsync = promisify(readFile);
    protected _existsAsync = promisify(exists);
    protected _writeStream: WriteStream;
    private _outputPath: string = this.getDefaultFileName();

    /**
     * Function to generate pdf with provided HTML string.
     * @param templateName Template name to be rendered.
     * @param data Data to be passed to template.
     * @param outputFileName Output file name.
     * @returns generated file path.
     */
    public async generatePdf(templateName: string, data: any, outputFileName?: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const htmlString = await this.renderHTMLTemplate(templateName, data);

                this._outputPath = this.getOutputPath(outputFileName);

                create(htmlString, { format: 'Letter' }).toStream((err, stream: Stream) => {
                    if (err) {
                        return reject(err);
                    }

                    stream.pipe(this._writeStream);
                    this._writeStream.on('close', () => {
                        return resolve(this._outputPath);
                    });
                });
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * Function to render a template and return rendered HTML string.
     * @param templateName Template name to be rendered
     * @param data Data to be passed to template.
     * @returns rendered HTML string.
     */
    public async renderHTMLTemplate(templateName: string, data: any, type: 'sms' | 'pdf' = 'pdf'): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const filePath = join(env.app.dirs.templates, config.get(`dirs.${type}`), `${templateName}.pug`);

                if (!await this._existsAsync(filePath)) {
                    return reject(new Error(`File not found. "${filePath}"`));
                }

                const template = await this._readFileAsync(require.resolve(filePath), 'utf-8');
                const compiledTemplate = compile(template);
                const renderedString = compiledTemplate({ data });
                return resolve(renderedString);
            } catch (err) {
                return reject(err);
            }
        });
    }

    private getOutputPath(fileName?: string): string {
        // if file name is provided update the file name with provided file name
        if (fileName) {
            this._outputPath = join(env.app.dirs.tempDir, config.get('dirs.pdf'), fileName);
        } else {
            this._outputPath = this.getDefaultFileName();
        }

        this._writeStream = createWriteStream(this._outputPath);
        return this._outputPath;
    }

    private getDefaultFileName(): string {
        const defaultFileName = `${new Date().getTime()}-${v4().split('-')[0]}.pdf`;
        return join(env.app.dirs.tempDir, config.get('dirs.pdf'), defaultFileName);
    }

}
