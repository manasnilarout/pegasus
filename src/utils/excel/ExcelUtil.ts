import { Row, Workbook, Worksheet } from 'exceljs';
import { extname } from 'path';

import { ExcelReadOptions } from './ExcelOptions';

export class ExcelUtil {
    protected readonly workbook: Workbook;

    constructor() {
        this.workbook = new Workbook();
    }

    /**
     * Method to read excel or CSV file.
     * @param path Path of the file to be read
     * @param options Options for reading excel/CSV
     * @returns Returns either array of strings or array of objects
     */
    public async readExcel(path: string, options: ExcelReadOptions): Promise<any[]> {
        return new Promise(async (resolve) => {
            const columns = options.columns || undefined;
            const firstRowHeading = options.firstRowHeading ? options.firstRowHeading : true;
            const worksheetName = options.worksheetName || 1;
            const maxRows = options.maxRows || undefined;
            const includeEmpty = options.includeEmpty || false;

            const excelData = [];

            let worksheet: Worksheet;

            const extension = extname(path);

            if (extension.includes('xls')) {
                const workbook = await this.workbook.xlsx.readFile(path);
                worksheet = workbook.getWorksheet(worksheetName);
            } else {
                worksheet = await this.workbook.csv.readFile(path);
            }

            worksheet.eachRow({ includeEmpty }, (row: Row, rowNumber: number) => {
                // Return data if max rows is specified
                if (excelData.length >= maxRows) {
                    return resolve(excelData);
                }

                // Skip the first row
                if (firstRowHeading && rowNumber === 1) {
                    return;
                }

                let currentRow;
                if (columns && columns.length) {
                    currentRow = this.getObject(row, columns);
                } else {
                    currentRow = this.getArray(row);
                }

                excelData.push(currentRow);

                if (worksheet.actualRowCount === rowNumber) {
                    return resolve(excelData);
                }
            });
        });
    }

    /**
     * Method to parse excel row to an object
     * @param row Excel row object
     * @param cols Columns to be parsed
     */
    private getObject(row: Row, cols: string[]): { [key: string]: string } {
        const rowData = {};
        const startIndex = this.getStartIndex(row);
        for (let i = startIndex; i < row.values.length; i++) {
            let currVal = row.values[i];
            if (typeof currVal === 'string') {
                currVal = currVal.trim();
            }
            rowData[cols[i - 1]] = currVal;
        }
        return rowData;
    }

    /**
     * Method to return row values in an array
     * @param row Excel row object
     */
    private getArray(row: Row): string[] {
        const startIndex = this.getStartIndex(row);
        const rowData = [];
        for (let i = startIndex; i < row.values.length; i++) {
            let currVal = row.values[i];
            if (typeof currVal === 'string') {
                currVal = currVal.trim();
            }
            rowData.push(currVal);
        }
        return rowData;
    }

    // first column is coming empty sometimes.
    private getStartIndex(row: Row): number {
        let startIndex = 0;
        if (row.values.length !== 0 && !row.values[0]) {
            startIndex = 1;
        }
        return startIndex;
    }
}
