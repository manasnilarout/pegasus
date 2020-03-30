import chalk from 'chalk';
import commander from 'commander';
import * as path from 'path';
import { createConnection, getConnectionOptions } from 'typeorm';
import { importSeed, runSeeder, setConnection } from 'typeorm-seeding';
import { MysqlDriver } from 'typeorm/driver/mysql/MysqlDriver';

import { config } from '../src/config';
import { env } from '../src/env';
import { importFiles, loadFiles } from '../src/utils/file.util';

// Cli helper
commander
  .version('1.0.0')
  .description('Run database seeds of your project')
  .option('-L, --logging', 'enable sql query logging')
  .option('--factories <path>', 'add filepath pattern (eg: ["src/database/factories/**/*{.js,.ts}"]) for your factories in array format')
  .option('--seeds <path>', 'add filepath pattern for your seeds in array format')
  .option('--run <seeds>', 'run specific seeds (file names without extension)', (val) => val.split(','))
  .parse(process.argv);

// Get cli parameter for a different factory path
const factoryPath = (commander.factories)
  ? JSON.parse(commander.factories)
  : ['src/database/factories/**/*{.js,.ts}'];

// Get cli parameter for a different seeds path
const seedsPath = (commander.seeds)
  ? JSON.parse(commander.seeds)
  : ['src/database/seeds/**/*{.js,.ts}'];

// Get a list of seeds
const listOfSeeds = (commander.run)
  ? commander.run.map(l => l.trim()).filter(l => l.length > 0)
  : [];

// Search for seeds and factories
const run = async () => {
  const log = console.log;

  let factoryFiles;
  let seedFiles;
  try {
    factoryFiles = await loadFiles(factoryPath);
    seedFiles = await loadFiles(seedsPath);
    // Import factory files
    importFiles(factoryFiles);
  } catch (error) {
    return handleError(error);
  }

  // Filter seeds
  if (listOfSeeds.length > 0) {
    seedFiles = seedFiles.filter(sf => listOfSeeds.indexOf(path.basename(sf).replace('.ts', '')) >= 0);
  }

  // Status logging to print out the amount of factories and seeds.
  log(chalk.bold('seeds'));
  log('🔎 ', chalk.gray.underline(`found:`),
    chalk.blue.bold(`${factoryFiles.length} factories`, chalk.gray('&'), chalk.blue.bold(`${seedFiles.length} seeds`)));

  // Get database connection and pass it to the seeder
  try {
    const loadedConnectionOptions = await getConnectionOptions();
    const connectionOptions = Object.assign(loadedConnectionOptions, {
        type: env.db.type as any, // See createConnection options for valid types
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        timezone: config.get('typeORM.mysql.timezone'),
        password: env.db.password,
        database: env.db.database,
        synchronize: env.db.synchronize,
        logging: env.db.logging,
        entities: env.app.dirs.entities,
        migrations: env.app.dirs.migrations,
    });
    const connection = await createConnection(connectionOptions);
    (connection.driver as MysqlDriver).pool.on('acquire', (conn) => {
        conn.query('SET @@session.time_zone = ?', [ config.get('typeORM.mysql.timezone') ]);
    });
    setConnection(connection);
  } catch (error) {
    return handleError(error);
  }

  // Show seeds in the console
  for (const seedFile of seedFiles) {
    try {
      let className = seedFile.split('/')[seedFile.split('/').length - 1];
      className = className.replace('.ts', '').replace('.js', '');
      className = className.split('-')[className.split('-').length - 1];
      log('\n' + chalk.gray.underline(`executing seed:  `), chalk.green.bold(`${className}`));
      const seedFileObject: any = importSeed(seedFile);
      await runSeeder(seedFileObject);
    } catch (error) {
      console.error('Could not run seed ', error);
      process.exit(1);
    }
  }

  log('\n👍 ', chalk.gray.underline(`finished seeding`));
  process.exit(0);
};

const handleError = (error) => {
  console.error(error);
  process.exit(1);
};

run();
