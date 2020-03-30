export interface ErrorResponse {
    code: string;
    data?: any;
    requestId?: string;
    status: 'fail' | 'error';
    message: string;
}
