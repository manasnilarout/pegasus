import { EventSubscriber, On } from 'event-dispatch';

import { events } from '../events';

@EventSubscriber()
export class KeyExpiryEventSubscriber {
    @On(events.Redis.KeyExpiry)
    public async onRedisKeyExpiry(message: string)
        : Promise<void> {
            // What happens on key expiry code goes here
         }

}
