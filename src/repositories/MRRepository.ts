import { EntityRepository, Repository } from 'typeorm';

import { Mr } from '../models/Mr';

@EntityRepository(Mr)
export class MrRepository extends Repository<Mr>  { }
