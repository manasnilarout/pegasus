import { EntityRepository, Repository } from 'typeorm';

import { ChemistMrs } from '../models/ChemistMrs';

@EntityRepository(ChemistMrs)
export class ChemistMrsRepository extends Repository<ChemistMrs>  { }
