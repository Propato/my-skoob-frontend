# My Skoob Frontend

This is the frontend system for my Skoob app, build using Vue.js with Typescript and Bootstrap.

This application consists of a set of views that allow the client to perform user CRUD, login and book and review CRUD, where any logged in user can add a book and create and modify their own reviews, while admins, in addition to these functions, can also update and validate shared books. Performing business rule validations and authentication token persistence are performed automatically with Vue in the Local Store.

## Requirements

### Versions

|                Tool                 | Version |
| :---------------------------------: | :-----: |
|                 NPM                 | 10.9.2  |
|                Node                 | 22.14.0 |
| VSCode Prettier Formatter Extension |  Auto   |

### .env

Follow the <a href="./.env_sample">.env_sample</a> to run the project.

## Scripts

### Running

#### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Stop Server

```sh
Ctrl + C
```

### Testing

#### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

#### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## :gear: Tools

| <img alt="Icon Typescript" title="Python3" height="60" src="./assets/typescript.svg"> | <img alt="Icon Vue.js" title="Vue.js" height="60" src="./assets/vue.svg"> | <img alt="Icon NodeJS" title="NodeJS" height="60" src="./assets/nodejs.svg"> |
| :-----------------------------------------------------------------------------------: | :-----------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|                                      Typescript                                       |                                  Vue.js                                   |                                    NodeJS                                    |

## To Do

- [ ] Add tests;
- [ ] Add documentation for routes and views.

<h6 align="center">by David Propato <a href="https://github.com/Propato">@Propato</a></h6>
