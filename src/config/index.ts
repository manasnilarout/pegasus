import convict from 'convict';
import * as path from 'path';

// Please add only those configuration values which do not change with Environment
// @TODO: Replace dotenv with this node convict
const config = convict({}).loadFile(path.join(__dirname, 'config.json'));

export { config };
export * from './FileUploadConfig';
