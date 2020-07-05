import { EntityRepository, Repository } from 'typeorm';

import { MrGiftOrders } from '../models/MrGiftOrders';

@EntityRepository(MrGiftOrders)
export class MrGiftOrdersRepository extends Repository<MrGiftOrders>  { }
