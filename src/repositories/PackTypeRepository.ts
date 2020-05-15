import { EntityRepository, Repository } from 'typeorm';

import { PackType } from '../models/PackType';

@EntityRepository(PackType)
export class PackTypeRepository extends Repository<PackType>  { }
