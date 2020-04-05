import { ValidationOptions } from 'class-validator';

import { FindRequest } from '../api/request/FindRequest';
import FindResponse from '../api/response/FindResponse';
import { LoggerInterface } from '../decorators/Logger';
import { AppError, AppNotFoundError, AppRuntimeError } from '../errors';
import { AppErrorCodes as ErrorCodes } from '../errors/codes';
import { AppFindRepository } from '../repositories/AppFindRepository';

export class AppService {
    protected log: LoggerInterface;
    protected constructor() { }

    protected classifyError(e: Error, code: string, msg: string, data?: any): AppError {
        if (e instanceof AppError) {
            return e;
        } else {
            return new AppRuntimeError(code, msg, e, data);
        }
    }

    protected getDefaultValidationOpts(customOpts?: ValidationOptions): ValidationOptions {
        return Object.assign({
            skipMissingProperties: false,
            forbidUnknownValues: true,
            validationError: {
                target: false,
            },
        }, customOpts);
    }

    protected handleError(err: Error, code: string, msg: string): AppError {
        const error = this.classifyError(err, code, msg);
        if (this.log) {
            error.log(this.log);
        }
        return error;
    }

    protected async fetchAll<T>(
        repository: AppFindRepository<T>, findOptions?: FindRequest
    ): Promise<FindResponse<T>> {
        return await this.fetch(repository, 'all', findOptions);
    }

    private async fetch<T>(
        repository: AppFindRepository<T>, output: 'all' | 'list', findOptions?: FindRequest
    ): Promise<FindResponse<T>> {
        try {
            let recordData;
            if (output === 'list') {
                recordData = await repository.findList(findOptions);
            } else {
                recordData = await repository.findAll(findOptions);
            }

            if (!recordData.records.length) {
                throw new AppNotFoundError(
                    ErrorCodes.recordsNotFoundError.id,
                    ErrorCodes.recordsNotFoundError.msg
                );
            }

            return recordData;
        } catch (e) {
            const error = this.classifyError(
                e,
                ErrorCodes.recordsFetchError.id,
                ErrorCodes.recordsFetchError.msg
            );
            error.log(this.log);
            throw error;
        }
    }
}
