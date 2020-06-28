import { Type } from 'class-transformer';

import { HqQrPointStatus } from '../../models/HqQrPoints';
import { FindRequest, ModelProp } from './FindRequest';

export default class HqQrPointsFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'hqQrPoints.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('hqQrPoints.status')
    @Type(() => Number)
    public status: HqQrPointStatus;

    @ModelProp('hqQrPoints.id')
    public id: number;

    @ModelProp('hqQrPoints.qrPointId')
    public qrPointId: number;

    @ModelProp('hqQrPoints.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;
}
