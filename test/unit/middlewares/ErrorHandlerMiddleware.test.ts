import MockExpressResponse from 'mock-express-response';

import { ErrorHandlerMiddleware } from '../../../src/api/http/middlewares/ErrorHandlerMiddleware';
import { AppBadRequestError, AppNotFoundError, AppRuntimeError } from '../../../src/errors';
import { LogMock } from '../lib/LogMock';

describe('ErrorHandlerMiddleware', () => {

    let log;
    let middleware;
    let res;
    beforeEach(() => {
        log = new LogMock();
        middleware = new ErrorHandlerMiddleware(log);
        res = new MockExpressResponse();
    });

    test('Should handle bad requests properly', () => {
        const err = new AppBadRequestError('hello', 'world', {
            email: 'hello@world.come',
        });
        middleware.isProduction = true;
        middleware.error(err, undefined, res, undefined);
        const json = res._getJSON();

        expect(json.status).toBe('fail');
        expect(json.message).toContain('world');
        expect(json.data).toBeDefined();
        expect(res.statusCode).toBe(400);
        expect(log.errorMock).toBeCalledTimes(0);
    });

    test('Should handle application errors properly', () => {
        const err = new AppRuntimeError('hello', 'world');

        middleware.isProduction = true;
        middleware.error(err, undefined, res, undefined);
        const json = res._getJSON();

        expect(json.status).toBe('error');
        expect(json.message).toContain('world');
        expect(json.data).toBeDefined();
        expect(res.statusCode).toBe(500);
        expect(log.errorMock).toBeCalledTimes(1);
    });

    test('Should return the proper status code', () => {
        let err = new AppRuntimeError('hello', 'world');
        middleware.isProduction = true;
        middleware.error(err, undefined, res, undefined);
        expect(res.statusCode).toBe(500);

        res = new MockExpressResponse();
        err = new AppNotFoundError('hello', 'world');
        middleware.error(err, undefined, res, undefined);
        expect(res.statusCode).toBe(404);
    });

});
