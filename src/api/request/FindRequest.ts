import { Type } from 'class-transformer';

export class FindRequest {
    public static addModelMapping(target: any, property: string, columnName: string): void {
        let modelMapping = this.modelColumnMap.get(target);

        if (!modelMapping) {
            modelMapping = new Map();
        }
        modelMapping.set(property, columnName);
        this.modelColumnMap.set(target, modelMapping);
    }

    public static getColumnName(target: FindRequest, property: string): string | void {
        const modelMapping = this.modelColumnMap.get(Object.getPrototypeOf(target));

        if (!modelMapping) {
            return;
        }

        return modelMapping.get(property);
    }

    public static getModelProperties(target: FindRequest): IterableIterator<string> | void {
        const modelMapping = this.modelColumnMap.get(Object.getPrototypeOf(target));

        if (!modelMapping) {
            return;
        }

        return modelMapping.keys();
    }

    private static modelColumnMap: Map<any, Map<string, string>> = new Map();

    @Type(() => Number)
    public limit: number;

    @Type(() => Number)
    public start: number;
    public orderBy: string | boolean;
    public order: 'ASC' | 'DESC';
}

export function ModelProp(columnName?: string): (target: any, propertyKey: string) => void {
    return (target: any, propertyKey: string) => {
        if (!columnName) {
            columnName = propertyKey;
        }
        FindRequest.addModelMapping(target, propertyKey, columnName);
    };
}
