import { AppError } from './AppError';

export class AppBadRequestError extends AppError {
    public constructor(code: string, msg: string, data?: any) {
        super(code, 'BadRequestError', msg, 'fail', data);
    }
}
