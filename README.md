# Active Stories

## Introduction

Active Stories is an application which helps users create and manage user stories. This helps make the process of breaking tasks into manageable user stories easy amd seamless.

## Features

the app has the following features:

- A User can:

  - create an account and login.
  - create user stories.
  - view all his/her stories.
  - view details of a story.

- An admin can:
  - stories are automatically marked as pending and can be approved/rejected by any admin
  - approve or reject a story.
  - view all stories on the application.
  - view the details of a story.

## Installation

To run the app locally, setup a local development environment. Ensure that [`Nodejs`](https://nodejs.org/en/download/) and [`PostgreSQL`](https://www.postgresql.org/download/) are installed on your machine.

1. Clone the repository: `git clone https://github.com/Veraclins/Maintenance-Tracker-React.git`.
2. Navigate to the project directory: `cd Maintenance-Tracker-React`
3. Install dependencies: `npm install`.
4. Change .env-example to .env.
5. Create a postgres database and update .env with the credentials (The database url is in the form of `postgres://username:password@host:PORT_NO/database_name`)
6. Set SSL to false in src/database/index.js (`SSL: false`)
7. Run `npm run dev` to start the app with hot reloading or `npm start` to start it normally.
8. visit http://localhost:3000 (or any port set in the .env file)

## Testing

To run the tests:

1. Ensure you have done items 1-5 above.
2. Run `npm test`

The API runs on PORT 3000 by default but you can run it on any port you want by updating the port in .env file.

The API docs is available [here](https://veratech.herokuapp.com/api-docs)

## Swagger Doc

[Click Here](https://app.swaggerhub.com/apis-docs/Veraclins-Com/active-stories/1.0.0)

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command
