import { EntityRepository, Repository } from 'typeorm';

import { City } from '../models/City';

@EntityRepository(City)
export class CityRepository extends Repository<City>  { }
