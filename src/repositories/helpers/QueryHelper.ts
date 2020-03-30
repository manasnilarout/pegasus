import { SelectQueryBuilder } from 'typeorm';

import { FindRequest } from '../../api/request/FindRequest';
import FindResponse from '../../api/response/FindResponse';

export default class QueryHelper {

    public static addWhere<T>(
        qb: SelectQueryBuilder<T>, request: FindRequest,
        condition: 'AND' | 'OR' = 'AND'
    ): void {
        const props = FindRequest.getModelProperties(request);
        if (!props) {
            throw new Error('Could not find properties for the given model!');
        }

        for ( const prop of props ) {
            if (!this.hasValue(request, prop)) {
                continue;
            }

            const whereString = this.getWhereString(request, prop );
            if ( condition === 'AND') {
                qb.andWhere(whereString, { [prop]: request[prop]} );
            } else {
                qb.orWhere(whereString, { [prop]: request[prop]} );
            }
        }
    }

    public static addPagination<T>(qb: SelectQueryBuilder<T>, limit: number, start: number): void {

        if (limit !== 0) {
            qb.take(limit);
        }

        if (start !== 0) {
            qb.skip(start);
        }
    }

    public static addOrder<T>(
        qb: SelectQueryBuilder<T>, orderBy: string|boolean, order: 'ASC' | 'DESC'): void {
        if (orderBy !== false && typeof orderBy === 'string') {
            qb.orderBy(orderBy, order);
        }
    }

    public static buildResponse<T>(
        details: [T[], number], limit: number, start: number
    ): FindResponse<T> {
        const records: T[] = details[0];
        const total = details[1];

        let nextStart = start + limit;
        if (nextStart > total) {
            nextStart = 0;
        }

        const response: FindResponse<T> = {
            limit,
            start,
            nextStart,
            records,
            total,
        };

        return response;
    }

    private static hasValue(obj: any, prop: string): boolean {
        if (obj.hasOwnProperty(prop) && obj[prop] !== undefined) {
            return true;
        }
        return false;
    }

    private static getWhereString(req: FindRequest, prop: string): string {
        if (Array.isArray(req[prop])) {
            return `${FindRequest.getColumnName(req, prop)} IN (:${prop})`;
        }
        return `${FindRequest.getColumnName(req, prop)} = :${prop}`;
    }
}
