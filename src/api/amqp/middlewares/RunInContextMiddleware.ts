import { AMQPRequest } from 'caleido-lib/amqp';
import { AMQPCallback } from 'caleido-lib/amqp/AMQPCallback';
import * as cls from 'cls-hooked';
import nanoid from 'nanoid/async';

import { config } from '../../../config';

// @TODO: Improve this since it actually handles the request, whereas a middleware simply runs before or after a request.
export async function RunInContextMiddleware(handlers: AMQPCallback[], message: AMQPRequest): Promise<void> {
  const clsNamespace: cls.Namespace = cls.getNamespace(config.get('clsNamespace.name'));
  clsNamespace.run(async () => {
    const requestId = await nanoid(10);
    clsNamespace.set('requestID', requestId);
    for (const handler of handlers) {
      await handler.instance[handler.method].call(handler.instance, message);
    }
  });
}
