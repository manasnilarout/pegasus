import { EntityRepository, Repository } from 'typeorm';

import { ProductType } from '../models/ProductType';

@EntityRepository(ProductType)
export class ProductTypeRepository extends Repository<ProductType>  { }
