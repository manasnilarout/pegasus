import { EntityRepository, Repository } from 'typeorm';

import ProductFindRequest from '../api/request/ProductFindRequest';
import FindResponse from '../api/response/FindResponse';
import { Product } from '../models/Product';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements AppFindRepository<Product>  {
    public async findAll(findOptions?: ProductFindRequest): Promise<FindResponse<Product>> {
        const queryBuilder = this.createQueryBuilder('product');
        queryBuilder.leftJoinAndSelect('product.packType', 'packType');
        queryBuilder.leftJoinAndSelect('product.productType', 'productType');
        queryBuilder.select();

        // Use query helper to build the query
        QueryHelper.buildQuery(queryBuilder, findOptions);
        // Run the query
        const facilityEventDetails = await queryBuilder.getManyAndCount();
        return QueryHelper.buildResponse(facilityEventDetails, findOptions.limit, findOptions.start);
    }

    public findList(findOptions?: ProductFindRequest): Promise<FindResponse<Product>> {
        throw new Error('Method not implemented.');
    }
}
