import { EntityRepository, Repository } from 'typeorm';

import ProductFindRequest from '../api/request/ProductFindRequest';
import FindResponse from '../api/response/FindResponse';
import { HqQrPointStatus } from '../models/HqQrPoints';
import { Product, ProductStatus } from '../models/Product';
import { QrPointsStatus } from '../models/QrPoints';
import { AppFindRepository } from './AppFindRepository';
import QueryHelper from './helpers/QueryHelper';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> implements AppFindRepository<Product>  {
    public async findAll(findOptions?: ProductFindRequest): Promise<FindResponse<Product>> {
        const queryBuilder = this.createQueryBuilder('product');
        queryBuilder.leftJoinAndSelect('product.packType', 'packType');
        queryBuilder.leftJoinAndSelect('product.productType', 'productType');
        queryBuilder.leftJoinAndSelect(
            'product.qrPoints',
            'qrPoints',
            'qrPoints.status = :status',
            { status: QrPointsStatus.ACTIVE }
        );
        queryBuilder.leftJoinAndSelect(
            'qrPoints.hqQrPoints',
            'hqQrPoints',
            'hqQrPoints.status = :hqQrStatus',
            { hqQrStatus: HqQrPointStatus.ACTIVE }
        );
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

    public async getProductPoints(hqId: number): Promise<Product[]> {
        const qb = this.createQueryBuilder('product');
        qb.leftJoinAndSelect(
            'product.qrPoints',
            'qrPoints',
            'qrPoints.status = :status',
            { status: QrPointsStatus.ACTIVE }
        );
        qb.leftJoinAndSelect(
            'qrPoints.hqQrPoints',
            'hqQrPoints',
            'hqQrPoints.status = :hqQrStatus' + (hqId ? ' AND hqQrPoints.hqId = :hqId' : ''),
            { hqQrStatus: HqQrPointStatus.ACTIVE, hqId }
        );

        qb.select([
            'product.id',
            'product.productName',
            'product.packSize',
            'product.points',
            'qrPoints.id',
            'qrPoints.points',
            'hqQrPoints.id',
            'hqQrPoints.hqQrPoints',
        ]);

        qb.where('product.status = :status', { status: ProductStatus.ACTIVE });

        return await qb.getMany();
    }
}
