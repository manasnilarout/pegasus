import { EntityRepository, Repository } from 'typeorm';

import { Specialty } from '../models/Specialty';

@EntityRepository(Specialty)
export class SpecialtyRepository extends Repository<Specialty>  { }
