import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';

import { HTTPSuccessResponse } from '../responses/HTTPSuccessResponse';

@Interceptor()
export class HTTPSuccessInterceptor implements InterceptorInterface {

    public intercept(action: Action, content: any): any {
        const httpResponse: HTTPSuccessResponse = {
            data: content,
            status: 'success',
        };

        return httpResponse;
    }

}
