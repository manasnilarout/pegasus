import { EntityRepository, Repository } from 'typeorm';

import { HeadQuarters } from '../models/HeadQuarters';

@EntityRepository(HeadQuarters)
export class HeadQuartersRepository extends Repository<HeadQuarters>  { }
