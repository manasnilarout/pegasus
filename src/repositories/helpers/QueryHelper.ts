import { Brackets, ObjectLiteral, SelectQueryBuilder, WhereExpression } from 'typeorm';

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

        qb.where(new Brackets(whereExpr => {
            for (const prop of props) {
                const value = request.getValue(prop);
                if (value === undefined) {
                    continue;
                }

                if (this.isObject(value)) {
                    throw new Error('addWhere does not support complex queries!');
                }

                const whereString = this.getWhereString(request, prop);

                if (condition === 'AND') {
                    whereExpr.andWhere(whereString, { [prop]: value });
                } else {
                    whereExpr.orWhere(whereString, { [prop]: value });
                }

            }
        }));
    }

    public static addComplexWhere<T>(
        qb: SelectQueryBuilder<T>, request: FindRequest,
        condition: 'AND' | 'OR' = 'AND'
    ): void {
        const props = FindRequest.getModelProperties(request);

        if (!props) {
            throw new Error('Could not find properties for the given model!');
        }

        qb.where(new Brackets(whereExpr => {
            for (const prop of props) {
                const propVal = request.getValue(prop);

                if (propVal === undefined) {
                    continue;
                }

                this.buildWhere(request, whereExpr, prop, propVal, condition);
            }
        }));
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
        qb: SelectQueryBuilder<T>, orderBy: string | boolean, order: 'ASC' | 'DESC'): void {
        if (orderBy !== false && typeof orderBy === 'string') {
            qb.orderBy(orderBy, order);
        }
    }

    public static buildQuery<T>(
        qb: SelectQueryBuilder<T>,
        request: FindRequest,
        selectedColumns?: string[],
        condition: 'AND' | 'OR' = 'AND'
    ): void {
        const searchableSortableColumns: {
            searchableColumns: string[],
            sortableColumns: string[]
        } = FindRequest.getSearchableSortableColumns(request);
        if (selectedColumns) {
            searchableSortableColumns.searchableColumns = searchableSortableColumns.searchableColumns.filter(
                column => selectedColumns.indexOf(column) !== -1
            );
            searchableSortableColumns.sortableColumns = searchableSortableColumns.searchableColumns.filter(
                column => selectedColumns.indexOf(column) !== -1
            );
        }
        this.addComplexWhere(qb, request);
        this.addPagination(qb, request.limit, request.start);
        const sortColumnIndex = searchableSortableColumns.sortableColumns.indexOf(request.orderBy.toString());

        if (sortColumnIndex !== -1) {
            this.addOrder(qb, request.orderBy, request.order);
        } else {
            throw new Error(`Ordering is not supported for ${request.orderBy} property`);
        }

        if (
            request.hasOwnProperty('searchTerm')
        ) {
            this.addSearch(qb, request.searchTerm, searchableSortableColumns.searchableColumns);
        }
    }

    public static addSearch<T>(
        qb: SelectQueryBuilder<T>,
        searchTerm: string,
        columnNames: string[]
    ): void {
        qb.andWhere(new Brackets(whereExp => {
            for (const prop of columnNames) {
                whereExp.orWhere(
                    `${prop} LIKE :searchString`,
                    { searchString: `%${searchTerm}%` }
                );
            }
        }));
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

    private static readonly comparators = {
        eq: '=',
        nte: '!=',
        gte: '>=',
        gt: '>',
        lte: '<=',
        lt: '<',
        arr: {
            eq: 'IN',
            nte: 'NOT IN',
        },
    };

    private static getWhereString(req: FindRequest, prop: string): string {
        const value = req[prop];
        if (Array.isArray(value)) {
            return `${FindRequest.getColumnName(req, prop)} IN (:${prop})`;
        } else if (QueryHelper.isObject(value)) {
            throw new Error('addWhere does not support complex queries!');
        }
        return `${FindRequest.getColumnName(req, prop)} = :${prop}`;
    }

    private static buildWhere<T>(
        request: FindRequest,
        qb: SelectQueryBuilder<T> | WhereExpression,
        prop: string,
        propVal: any[] | any | { [prop: string]: any },
        condition: 'AND' | 'OR',
        comparator: string = 'eq'
    ): void {
        let paramValues: ObjectLiteral;
        let comparisonString = '';

        // Determine the type of propVal and process accordingly.
        if (Array.isArray(propVal)) {
            // Its an array, so we need IN or NOT IN
            if (!QueryHelper.comparators.arr.hasOwnProperty(comparator)) {
                throw new Error(`Invalid comparator passed for ${prop}: ${comparator}`);
            }
            // Handle array - Array needs to be done first.
            comparisonString = `${FindRequest.getColumnName(request, prop)}
                ${QueryHelper.comparators.arr[comparator]} (:${prop})`;
            paramValues = { [prop]: propVal };
        } else if (typeof propVal === 'object') {
            // An object, need to be recursive here in order to handle each property in the object
            // Put all these conditions in a bracket
            for (const compareKey of Object.keys(propVal)) {
                const propKey = `${prop}.${compareKey}`;
                // We do not need OR here, assuming that all conditions in an
                // object will be joined with AND
                comparisonString += this.buildWhere(
                    request, qb, propKey,
                    propVal[compareKey], 'AND', compareKey
                );
            }
            return;
        } else {
            if (!QueryHelper.comparators.hasOwnProperty(comparator)) {
                throw new Error(`Invalid comparator passed for ${prop}: ${comparator}`);
            }
            // Handle string!
            comparisonString = `${FindRequest.getColumnName(request, prop)}
             ${QueryHelper.comparators[comparator]} :${prop}`;
            paramValues = { [prop]: propVal };
        }

        if (condition === 'AND') {
            qb.andWhere(comparisonString, paramValues);
        } else {
            qb.orWhere(comparisonString, paramValues);
        }
    }

    private static isObject(a: any): boolean {
        return (!!a) && (a.constructor === Object);
    }
}
