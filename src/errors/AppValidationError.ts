import { AppError } from './AppError';

export class AppValidationError extends AppError {
    public constructor(code: string, msg: string, data?: any) {
        super(code, 'ValidationFailedError', msg, 'fail', data);
    }
}
