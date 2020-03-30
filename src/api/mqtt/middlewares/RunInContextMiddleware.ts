import * as cls from 'cls-hooked';
import nanoid from 'nanoid/async';
import { config } from '../../../config';
import { MQTTRequest } from 'caleido-lib/mqtt';
import { MQTTCallback } from 'caleido-lib/mqtt/MQTTCallback';

// @TODO: Improve this since it actually handles the request, whereas a middleware simply runs before or after a request.
export async function RunInContextMiddleware(handlers: MQTTCallback[], message: MQTTRequest, packet: {}): Promise<void> {
  const clsNamespace: cls.Namespace = cls.getNamespace(config.get('clsNamespace.name'));
    clsNamespace.run(async () => {
      const requestId = await nanoid(10);
      clsNamespace.set('requestID', requestId);
      for (const handler of handlers) {
        await handler.instance[handler.method].call(handler.instance, message, packet);
      }
  });
}
