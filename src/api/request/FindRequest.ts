import { Transform, Type } from 'class-transformer';

import { Dictionary } from '../../types/Dictionary';

export class FindRequest {
    public static addModelMapping(
        target: any,
        property: string,
        columnName: string,
        characteristic: Partial<{ sortable: boolean, searchable: boolean }>
    ): void {
        let modelMapping = this.modelColumnMap.get(target);
        if (!modelMapping) {
            modelMapping = new Map();
        }
        const mapValue = {
            columnName,
            sortable: characteristic.sortable,
            searchable: characteristic.searchable,
        };
        modelMapping.set(property, mapValue);
        this.modelColumnMap.set(target, modelMapping);
    }

    public static getColumnName(target: FindRequest, property: string): string | void {
        const modelMapping = this.modelColumnMap.get(Object.getPrototypeOf(target));

        if (!modelMapping) {
            return;
        }

        let columnObj = modelMapping.get(property);
        let columnName = columnObj ? columnObj.columnName : '';

        if (columnName) {
            return columnName;
        }

        const dotIndex = property.indexOf('.');
        if (dotIndex === -1) {
            throw new Error(`Column name not found for model property: ${property}.`);
        }

        property = property.slice(0, dotIndex);

        columnObj = modelMapping.get(property);
        columnName = columnObj ? columnObj.columnName : '';

        if (columnName) {
            return columnName;
        }

        throw new Error(`Column name not found for model property: ${property}.`);
    }

    public static getSearchableSortableColumns(
        target: FindRequest
    ): { searchableColumns: string[], sortableColumns: string[] } {
        const modelMapping = this.modelColumnMap.get(Object.getPrototypeOf(target));
        const searchableColumns: string[] = [];
        const sortableColumns: string[] = [];
        const columnKeys = modelMapping.keys();

        for (const prop of columnKeys) {
            const columnObj = modelMapping.get(prop);

            if (columnObj.searchable) {
                searchableColumns.push(columnObj.columnName);
            }

            if (columnObj.sortable) {
                sortableColumns.push(columnObj.columnName);
            }
        }

        return { searchableColumns, sortableColumns };
    }

    public static getModelProperties(target: FindRequest): IterableIterator<string> | void {
        const modelMapping = this.modelColumnMap.get(Object.getPrototypeOf(target));

        if (!modelMapping) {
            return;
        }

        return modelMapping.keys();
    }

    public static hasValue(obj: any, prop: string): boolean {
        if (obj.hasOwnProperty(prop) && obj[prop] !== undefined) {
            return true;
        }
        return false;
    }

    private static modelColumnMap: Map<
        any,
        Map<string, { columnName: string, sortable: boolean, searchable: boolean }>
    > = new Map();

    @Type(() => Number)
    public limit: number;

    @Type(() => Number)
    public start: number;
    public orderBy: string | boolean;
    public order: 'ASC' | 'DESC';
    public searchTerm: string;

    @Type(() => String)
    @Transform(value => JSON.parse(value), { toClassOnly: true })
    protected __parsedQuery: Dictionary<Dictionary<any>>;

    public getValue(prop: string):
        any | any[] | Dictionary<any> | undefined {
        if (FindRequest.hasValue(this, prop)) {
            return this[prop];
        }

        if (this.__parsedQuery && FindRequest.hasValue(this.__parsedQuery, prop)) {
            return this.__parsedQuery[prop];
        }

        return undefined;
    }
}

export function ModelProp(
    columnName?: string,
    characteristic: Partial<{ sortable: boolean, searchable: boolean }> = { sortable: false, searchable: false }
): (target: any, propertyKey: string) => void {
    return (target: any, propertyKey: string) => {

        if (!columnName) {
            columnName = propertyKey;
        }

        characteristic.sortable = characteristic.sortable || false;
        characteristic.searchable = characteristic.searchable || false;
        FindRequest.addModelMapping(target, propertyKey, columnName, characteristic);
    };
}
