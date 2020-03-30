import { AppError } from './AppError';

export class AppRuntimeError extends AppError {
    public constructor(code: string, msg: string, error?: Error, data?: any) {
        super(code, 'RuntimeError', msg, 'error', data, error);
    }
}
