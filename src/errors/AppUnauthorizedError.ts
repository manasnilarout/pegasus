import { AppError } from './AppError';

export class AppUnauthorizedError extends AppError {
    public constructor(code: string, msg: string, data?: any) {
        super(code, 'UnauthorizedError', msg, 'fail', data, '', 401);
    }
}
