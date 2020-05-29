import { Type } from 'class-transformer';

import { FindRequest, ModelProp } from './FindRequest';

export default class ProductFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'product.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('product.productTypeId')
    @Type(() => Number)
    public productType: number;

    @ModelProp('product.id')
    @Type(() => Number)
    public id: number;

    @ModelProp('product.name')
    public name: number;

    @ModelProp('product.brand')
    public brand: number;

    @ModelProp('product.packTypeId')
    public packType: number;

    @ModelProp('product.createdBy')
    public createdBy: number;

    @ModelProp('product.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;
}
