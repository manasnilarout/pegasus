import { Type } from 'class-transformer';

import { UserStatus } from '../../models/User';
import { FindRequest, ModelProp } from './FindRequest';

export default class UserFindRequest extends FindRequest {
    public limit = 10;
    public start = 0;
    public orderBy = 'user.createdOn';
    public order: 'ASC' | 'DESC' = 'ASC';

    @ModelProp('user.status')
    @Type(() => Number)
    public status: UserStatus;

    @ModelProp('user.designation')
    public designation: string;

    @ModelProp('user.userId')
    public id: number;

    @ModelProp('user.headQuarter')
    public headQuarter: number;

    @ModelProp('user.createdOn', { sortable: true })
    @Type(() => Date)
    public createdOn: Date;
}
