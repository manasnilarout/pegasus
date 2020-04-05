import { FindRequest } from '../api/request/FindRequest';
import FindResponse from '../api/response/FindResponse';

export interface AppFindRepository<T> {
    findAll(findOptions?: FindRequest): Promise<FindResponse<T>>;
    findList(findOptions?: FindRequest): Promise<FindResponse<T>>;
}
