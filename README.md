<h1 align="center">Node Starter Boilerplate</h1>
<p align="center">
  <sub>Made with ❤️ by <a href="https://www.osmosys.asia">Osmosys Software Solutions</a></sub>
</p>

---

## ❯ Why

A framework to bootstrap development using Node.js API Services with code written in TypeScript.

### Features

- **Annotations** of the libraries from [pleerock](https://github.com/pleerock).
- **Dependency Injection** done with framework from [TypeDI](https://github.com/pleerock/typedi).
- **Simplified Database Query** with the ORM [TypeORM](https://github.com/typeorm/typeorm).
- **Clear Structure** with different layers such as controllers, services, repositories, models, middlewares...
- **Exception Handling** using [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Validation** using [class-validator](https://github.com/pleerock/class-validator) with some nice annotations.
- **Custom Validators** to for further request validation. [custom-validation-classes](https://github.com/pleerock/class-validator#custom-validation-classes).
- **API Documentation** using [swagger](http://swagger.io/).
- **API Monitoring** using [express-status-monitor](https://github.com/RafalWilinski/express-status-monitor).
- **Integrated Testing Tool** using [Jest](https://facebook.github.io/jest).
- **E2E API Testing** using [supertest](https://github.com/visionmedia/supertest).
- **Basic Security Features** using [Helmet](https://helmetjs.github.io/).
- **Fast Database Building** with migration from [TypeORM](https://github.com/typeorm/typeorm).
- **Easy Data Seeding** with custom factories.

----

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Scripts and Tasks](#-scripts-and-tasks)
- [Debugger in VSCode](#-debugger-in-vscode)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [Logging](#-logging)
- [Event Dispatching](#-event-dispatching)
- [Seeding](#-seeding)
- [Further Documentations](#-further-documentation)

----

## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
npm install yarn
```

Install a MySQL database.

**Recommend:** Instead of going through all these hoops and setting up your machine, we've set a Vagrant box that you can use to get started quickly. Please check the [this doc](docs/vagrant.md) for further information.


> If you work with a mac, we recommend to use homebrew for the installation.

### Step 2: Create new Project

Fork or download this project. Configure your package.json for your new project.

Then copy the `.env.example` file and rename it to `.env`.

Create a new database with the name you have in your `.env`-file.

Then setup your application environment.

```bash
yarn run setup
```

> This installs all dependencies with yarn. After that it migrates the database and seeds some test data into it. So after that your development environment is ready to use.

### Step 3: Serve your App

Go to the project dir and start your app with this yarn script.

```bash
yarn start serve
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the sever according to these changes.
> The server address will be displayed to you as `http://0.0.0.0:3000`.

----

## ❯ Scripts and Tasks

All script are defined in the `package-scripts.js` file, but the most important ones are listed here.

### Install

- Install all dependencies with `yarn install`

### Linting

- Run code quality analysis using `yarn start lint`. This runs tslint.
- There is also a vscode task for this called `lint`.

### Tests

- Run the unit tests using `yarn start test` (There is also a vscode task for this called `test`).
- Run the integration tests using `yarn start test.integration`.
- Run the e2e tests using `yarn start test.e2e`.

### Running in dev mode

- Run `yarn start serve` to start nodemon with ts-node, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:3000`

### Building the project and run it

- Run `yarn start build` to generated all JavaScript files from the TypeScript sources (There is also a vscode task for this called `build`).
- To start the builded app located in `dist` use `yarn start`.

### Database Migration

- Run `typeorm migration:create -n <migration-file-name>` to create a new migration file.
- Try `typeorm -h` to see more useful cli commands like generating migration out of your models.
- To migrate your database run `yarn start db.migrate`.
- To revert your latest migration run `yarn start db.revert`.
- Drops the complete database schema `yarn start db.drop`.

### Database Seeding

- Run `yarn start db.seed` to seed your seeds into the database.

----

## ❯ Debugger in VSCode

To debug your code run `yarn start build` or hit <kbd>cmd</kbd> + <kbd>b</kbd> to build your app.
Then, just set a breakpoint and hit <kbd>F5</kbd> in your Visual Studio Code.

----

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route          | Description |
| -------------- | ----------- |
| **/api**       | Shows us the name, description and the version of the package.json |
| **/graphql**   | Route to the graphql editor or your query/mutations requests |
| **/swagger**   | This is the Swagger UI with our API documentation |
| **/monitor**   | Shows a small monitor page for the server |
| **/api/users** | Example entity endpoint |
| **/api/pets**  | Example entity endpoint |

----

## ❯ Project Structure

| Name                              | Description |
| --------------------------------- | ----------- |
| **.vscode/**                      | VSCode tasks, launch configuration and some other settings |
| **dist/**                         | Compiled source files will be placed here |
| **src/**                          | Source files |
| **src/api/amqp/**                 | AMQP protocol controllers |
| **src/api/http/**                 | HTTP protocol controllers |
| **src/api/mqtt/**                 | MQTT protocol controllers |
| **src/api/http/requests**         | HTTP Request classes with validation rules if the body is not equal with a model |
| **src/api/http/responses**        | HTTP Response classes or interfaces to type json response bodies |
| **src/api/http/errors/**          | Custom HTTP Errors like 404 not found |
| **src/api/http/interceptors/**    | Interceptors are used to change or replace the data returned to the client during an HTTP response|
| **src/api/http/middlewares/**     | Express Middlewares like helmet security features. Used with HTTP requests. |
| **src/api/models/**               | Bookshelf Models |
| **src/api/repositories/**         | Repository / DB layer |
| **src/api/services/**             | Service layer |
| **src/api/subscribers/**          | Event subscribers |
| **src/api/validators/**           | Custom validators, which can be used in the request classes |
| **src/api/** swagger.json         | Swagger documentation |
| **src/auth/**                     | Authentication checkers and services |
| **src/core/**                     | The core features like logger and env variables |
| **src/database/factories**        | Factory the generate fake entities |
| **src/database/migrations**       | Database migration scripts |
| **src/database/seeds**            | Seeds to create some data in the database |
| **src/decorators/**               | Custom decorators like @Logger & @EventDispatch |
| **src/types/** *.d.ts             | Custom type definitions and files that aren't on DefinitelyTyped |
| **test**                          | Tests |
| **test/e2e/** *.test.ts           | End-2-End tests (like e2e) |
| **test/integration/** *.test.ts   | Integration test with SQLite3 |
| **test/unit/** *.test.ts          | Unit tests |
| .env.example                      | Environment configurations |
| .env.test                         | Test environment configurations |
| mydb.sql                          | SQLite database for integration tests. Ignored by git and only available after integration tests |

----

## ❯ Logging

Our logger is [winston](https://github.com/winstonjs/winston). To log http request we use the express middleware [morgan](https://github.com/expressjs/morgan).
We created a simple annotation to inject the logger in your service (see example below).

```typescript
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    ...
```

----

## ❯ Event Dispatching

```
// TODO : Update
```

----

## ❯ Seeding

How does it work? Just create a factory for your entities (models) and a seed script.

### 1. Create a factory for your entity

For all entities we want to seed, we need to define a factory. To do so we give you [faker](https://github.com/marak/Faker.js/) library as a parameter into your factory. Then create your "fake" entity and return it. Those factory files should be in the `src/database/factories` folder and suffixed with `Factory` like `src/database/factories/UserFactory.ts`.

Settings can be used to pass some static value into the factory.

```typescript
define(User, (faker: typeof Faker, settings: { roles: string[] }) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.roles = settings.roles;
    return user;
});
```

Handle relation in the entity factory like this.

```typescript
define(Pet, (faker: typeof Faker, settings: undefined) => {
    const gender = faker.random.number(1);
    const name = faker.name.firstName(gender);

    const pet = new Pet();
    pet.name = name;
    pet.age = faker.random.number();
    pet.user = factory(User)({ roles: ['admin'] })
    return pet;
});
```

### 2. Create a seed file

The seeds files define how much and how the data are connected with each other. The files will be executed alphabetically.
With the second function, accepting your settings defined in the factories, you are able to create different variations of entities.

```typescript
export class CreateUsers implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        await factory(User)({ roles: [] }).createMany(10);
    }

}
```

Here an example with nested factories. You can use the `.map()` function to alter
the generated value before they get persisted.

```typescript
...
await factory(User)()
    .map(async (user: User) => {
        const pets: Pet[] = await factory(Pet)().createMany(2);
        const petIds = pets.map((pet: Pet) => pet.Id);
        await user.pets().attach(petIds);
    })
    .createMany(5);
...
```

To deal with relations you can use the entity manager like this.

```typescript
export class CreatePets implements SeedsInterface {

    public async seed(factory: FactoryInterface, connection: Connection): Promise<any> {
        const connection = await factory.getConnection();
        const em = connection.createEntityManager();

        await times(10, async (n) => {
            // This creates a pet in the database
            const pet = await factory(Pet)().create();
            // This only returns a entity with fake data
            const user = await factory(User)({ roles: ['admin'] }).make();
            user.pets = [pet];
            await em.save(user);
        });
    }

}
```

### 3. Run the seeder

The last step is to just hit the following command in your terminal, but be sure you are in the projects root folder.

```bash
yarn start db.seed
```

#### CLI Interface

| Command                                              | Description |
| ---------------------------------------------------- | ----------- |
| `yarn start "db.seed"`                               | Run all seeds |
| `yarn start "db.seed --run CreateBruce,CreatePets"`  | Run specific seeds (file names without extension) |
| `yarn start "db.seed -L"`                            | Log database queries to the terminal |
| `yarn start "db.seed --factories <path>"`            | Add a different path to your factories (Default: `src/database/`) |
| `yarn start "db.seed --seeds <path>"`                | Add a different path to your seeds (Default: `src/database/seeds/`) |

----

## ❯ Further Documentations

| Name & Link                       | Description                       |
| --------------------------------- | --------------------------------- |
| [Express](https://expressjs.com/) | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| [Microframework](https://github.com/pleerock/microframework) | Microframework is a simple tool that allows you to execute your modules in a proper order, helping you to organize bootstrap code in your application. |
| [TypeDI](https://github.com/pleerock/typedi) | Dependency Injection for TypeScript. |
| [routing-controllers](https://github.com/pleerock/routing-controllers) | Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework. |
| [TypeORM](http://typeorm.io/#/) | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework. |
| [class-validator](https://github.com/pleerock/class-validator) | Validation made easy using TypeScript decorators. |
| [class-transformer](https://github.com/pleerock/class-transformer) | Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors |
| [Helmet](https://helmetjs.github.io/) | Helmet helps you secure your Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! |
| [Jest](http://facebook.github.io/jest/) | Delightful JavaScript Testing Library for unit and e2e tests |
| [supertest](https://github.com/visionmedia/supertest) | Super-agent driven library for testing node.js HTTP servers using a fluent API |
| [nock](https://github.com/node-nock/nock) | HTTP mocking and expectations library |
| [swagger Documentation](http://swagger.io/) | API Tool to describe and document your api. |
| [SQLite Documentation](https://www.sitepoint.com/getting-started-sqlite3-basic-commands/) | Getting Started with SQLite3 – Basic Commands. |
| [DataLoader Documentation](https://github.com/facebook/dataloader) | DataLoader is a generic utility to be used as part of your application's data fetching layer to provide a consistent API over various backends and reduce requests to those backends via batching and caching. |

---

## ❯ License

Contact [Osmosys](https://osmosys.asia/)
