import { AppError } from './AppError';

export class AppNotFoundError extends AppError {
    public constructor(code: string, msg: string, data?: any) {
        super(code, 'NotFoundError', msg, 'fail', data, undefined, 404);
    }
}
