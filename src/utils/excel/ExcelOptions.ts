export interface ExcelReadOptions {
    /**
     * @Array Expected column names from the excel to generate an object
     * Order is important
     */
    columns?: string[];
    /**
     * @string Worksheet name to be read
     * @default 1
     */
    worksheetName?: string;
    /**
     * @boolean To set first row as heading and not look for values from there
     * @default true
     */
    firstRowHeading?: boolean;
    /**
     * @number Maximum number of rows to be returned
     * @default undefined
     */
    maxRows?: number;
    /**
     * @boolean To consider empty rows
     * @default false
     */
    includeEmpty?: boolean;
}
