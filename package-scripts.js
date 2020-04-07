/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, rimraf, } = require('nps-utils');

// TODO: Need to find out a way of using env here.
module.exports = {
    scripts: {
        default: 'nps start',
        /**
         * Starts the builded app from the dist directory.
         */
        start: {
            script: 'cross-env NODE_ENV=production node dist/app.js',
            description: 'Starts the built app',
        },
        /**
         * Serves the current app and watches for changes to restart it
         */
        serve: {
            inspector: {
                script: series(
                    'nps banner.serve',
                    'nodemon --watch src --watch .env --legacy-watch --ignore src/loaders/ --ignore src/types/ --ignore src/utils/ --ignore src/config/ --delay 2 --inspect=0.0.0.0:9229'
                ),
                description: 'Serves the current app and watches for changes to restart it, you may attach inspector to it.'
            },
            script: series(
                'nps banner.serve',
                'nodemon --watch src --watch .env --legacy-watch --ignore src/loaders/ --ignore src/types/ --ignore src/utils/ --ignore src/config/ --delay 2'
            ),
            swagger: {
                script: series(
                    'nps banner.serve',
                    'nps swagger.generate',
                    'nodemon --watch src --watch .env --legacy-watch --ignore src/loaders/ --ignore src/types/ --ignore src/utils/ --ignore src/config/ --delay 2'
                ),
            },
            description: 'Serves the current app and watches for changes to restart it'
        },
        /**
         * Regenerate swagger files while restarting the server
         */
        nodemon: {
            script: series(
                runFast('src/app.ts'),
            ),
            description: 'Restart server'
        },
        /**
         * Setup of the development environment
         */
        setup: {
            script: series(
                'yarn install',
                'nps db.setup',
            ),
            description: 'Sets up the development environment(yarn & database)'
        },
        /**
         * Creates the needed configuration files
         */
        config: {
            script: series(
                runFast('./commands/tsconfig.ts'),
            ),
            hiddenFromHelp: true
        },
        /**
         * Builds the app into the dist directory
         */
        build: {
            script: series(
                'nps banner.build',
                'nps config',
                'nps lint',
                'nps clean.dist',
                'nps transpile',
                'nps copy.tmp',
                'nps copy.config',
                'nps copy.templates',
                'nps copy.temp',
                'nps clean.tmp'
            ),
            description: 'Builds the app into the dist directory'
        },
        /**
         * Runs TSLint over your project
         */
        lint: {
            script: tslint(`./src/**/*.ts`),
            hiddenFromHelp: true,
            fix: {
                script: tslintFix(`./src/**/*.ts`),
                description: 'Serves the current app and watches for changes to restart it, you may attach inspector to it.'
            }
        },
        /**
         * Transpile your app into javascript
         */
        transpile: {
            script: `tsc --project ./tsconfig.build.json`,
            hiddenFromHelp: true
        },
        /**
         * Clean files and folders
         */
        clean: {
            default: {
                script: series(
                    `nps banner.clean`,
                    `nps clean.dist`
                ),
                description: 'Deletes the ./dist folder'
            },
            dist: {
                script: rimraf('./dist'),
                hiddenFromHelp: true
            },
            tmp: {
                script: rimraf('./.tmp'),
                hiddenFromHelp: true
            }
        },
        /**
         * Converts YAML files to json
         */
        swagger: {
            generate: swaggerConvert(),
        },
        /**
         * Copies static files to the build folder
         */
        copy: {
            default: {
                script: series(
                    `nps copy.swagger`
                ),
                hiddenFromHelp: true
            },
            swagger: {
                script: copyDir(
                    './src/swagger',
                    './dist/swagger',
                    1
                ),
                hiddenFromHelp: true
            },
            templates: {
                script: copy(
                    './src/templates/**/*.*',
                    './dist/templates/',
                    2
                ),
                hiddenFromHelp: true
            },
            tmp: {
                script: copyDir(
                    './.tmp/src',
                    './dist'
                ),
                hiddenFromHelp: true
            },
            config: {
                script: copy(
                    './src/config/*.json',
                    './dist/config/',
                    2
                ),
                hiddenFromHelp: true
            },
            temp: {
                script: copyDir(
                    './src/tmp/',
                    './dist/tmp/'
                ),
                hiddenFromHelp: true
            },
        },
        /**
         * Database scripts
         */
        db: {
            migrate: {
                script: series(
                    'nps banner.migrate',
                    'nps config',
                    runFast('src/app.ts migration:run')
                ),
                description: 'Migrates the database to the newest version available'
            },
            revert: {
                script: series(
                    'nps banner.revert',
                    'nps config',
                    runFast('src/app.ts migration:revert')
                ),
                description: 'Downgrades the database'
            },
            seed: {
                script: series(
                    'nps banner.seed',
                    'nps config',
                    runFast('./commands/seed.ts')
                ),
                description: 'Seeds generated records into the database'
            },
            drop: {
                script: runFast('src/app.ts migration:drop-schema'),
                description: 'Drops the schema of the database'
            },
            setup: {
                script: series(
                    'nps db.drop',
                    'nps db.migrate',
                    'nps db.seed'
                ),
                description: 'Recreates the database with seeded data'
            }
        },
        /**
         * These run various kinds of tests. Default is unit.
         */
        test: {
            default: 'nps test.unit',
            unit: {
                default: {
                    script: series(
                        'nps banner.testUnit',
                        'nps test.unit.pretest',
                        'nps test.unit.run'
                    ),
                    description: 'Runs the unit tests'
                },
                pretest: {
                    script: tslint(`./test/unit/**.ts`),
                    hiddenFromHelp: true
                },
                run: {
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=unit',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
            mqttTest: {
                default: {
                    script: series(
                        'nps test.mqtt.run'
                    )
                },
                run: {
                    // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=mqtt -i',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
            redisTest: {
                default: {
                    script: series(
                        'nps test.redis.run'
                    )
                },
                run: {
                    // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=redis -i',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
            amqpTest: {
                default: {
                    script: series(
                        'nps test.amqp.run'
                    )
                },
                run: {
                    // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=amqp -i',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
            integration: {
                default: {
                    script: series(
                        'nps banner.testIntegration',
                        'nps test.integration.pretest',
                        'nps test.integration.run'
                    ),
                    description: 'Runs the integration tests'
                },
                pretest: {
                    script: tslint(`./test/integration/**.ts`),
                    hiddenFromHelp: true
                },
                run: {
                    // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=integration -i',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
            e2e: {
                default: {
                    script: series(
                        'nps banner.testE2E',
                        'nps test.e2e.pretest',
                        'nps test.e2e.run'
                    ),
                    description: 'Runs the e2e tests'
                },
                pretest: {
                    script: tslint(`./test/e2e/**.ts`),
                    hiddenFromHelp: true
                },
                run: {
                    // -i. Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging.
                    script: 'cross-env NODE_ENV=test jest --testPathPattern=e2e -i',
                    hiddenFromHelp: true
                },
                verbose: {
                    script: 'nps "test --verbose"',
                    hiddenFromHelp: true
                },
                coverage: {
                    script: 'nps "test --coverage"',
                    hiddenFromHelp: true
                }
            },
        },
        /**
         * This creates pretty banner to the terminal
         */
        banner: {
            build: banner('build'),
            serve: banner('serve'),
            testUnit: banner('test.unit'),
            testIntegration: banner('test.integration'),
            testE2E: banner('test.e2e'),
            migrate: banner('migrate'),
            seed: banner('seed'),
            revert: banner('revert'),
            clean: banner('clean'),
            mqtt: banner('mqttTest'),
        }
    }
};

function banner(name) {
    return {
        hiddenFromHelp: true,
        silent: true,
        description: `Shows ${name} banners to the console`,
        script: runFast(`./commands/banner.ts ${name}`),
    };
}

function copy(source, target, up) {
    return `copyfiles --up ${up} ${source} ${target}`;
}

function copyDir(source, target) {
    return `ncp ${source} ${target}`;
}

function run(path) {
    return `ts-node ${path}`;
}

function runFast(path) {
    return `ts-node --transpile-only ${path}`;
}

function swaggerConvert() {
    return {
        hiddenFromHelp: true,
        silent: true,
        script: runSwaggerResolver(),
    };
}

function runSwaggerResolver() {
    return `cd src/swagger && ../../node_modules/.bin/multi-file-swagger base.yaml > index.json`;
}

function tslint(path) {
    return `tslint -c ./tslint.json ${path} --format stylish`;
}

function tslintFix(path) {
    return `tslint -c ./tslint.json ${path} --fix`
}
