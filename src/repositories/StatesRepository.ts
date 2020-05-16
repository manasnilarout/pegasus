import { EntityRepository, Repository } from 'typeorm';

import { States } from '../models/States';

@EntityRepository(States)
export class StatesRepository extends Repository<States>  { }
