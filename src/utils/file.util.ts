import { rename } from 'fs';
import * as glob from 'glob';
import { platform } from 'os';
import { extname, join } from 'path';
import { promisify } from 'util';

export const importFiles = (filePaths: string[]) => filePaths.forEach(require);

export const moveAsync = promisify(rename);

export const filePathDelimiter = (): '\\' | '/' => {
    return platform().includes('win') ? '\\' : '/';
};

export const loadFiles = (filePattern: string[]): string[] => {
    return filePattern
        .map(pattern => glob.sync(join(process.cwd(), pattern)))
        .reduce((acc, filePath) => acc.concat(filePath), []);
};

/**
 * Method to move file from one directory to another
 * @param source Source file path of the file
 * @param destination Destination, where the file should be copied to
 * @param newFileName New name for the file
 */
export const moveFile = async (source: string, destination: string, newFileName?: string)
    : Promise<string> => {
    const fileNameWithExtension = getFileName(source);
    const destinationPath =
        `${destination}${destination.match(/(\/|\\)$/) ? '' : filePathDelimiter()}${fileNameWithExtension}`;
    await moveAsync(source, destinationPath);
    if (newFileName) {
        return await renameFile(destinationPath, newFileName);
    }
    return destinationPath;
};

export const renameFile = async (filePath: string, newName: string): Promise<string> => {
    const fileNameWithExtension = getFileName(filePath);
    const extension = extname(filePath);
    const updatedFilePath = filePath.replace(fileNameWithExtension, `${newName}${extension}`);
    await moveAsync(filePath, updatedFilePath);
    return updatedFilePath;
};

export const getFileName = (path: string): string => {
    return path.replace(/.*(\/|\\)([a-zA-Z_\-\.\s0-9]+$)/, '$2');
};
