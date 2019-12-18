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

1. Clone the repository: `git clone git@github.com:Veraclins/active-stories.git`.
2. Navigate to the project directory: `cd active-stories`
3. Install dependencies: `yarn`.
4. Change .env-example to .env `cp .env.example .env` and fill the variables.
5. Create a postgres database and update .env with the credentials
6. Run `yarn start` to start the app with hot reloading.
7. visit http://localhost:3000 (or any port set in the .env file) see [docs](https://app.swaggerhub.com/apis-docs/Veraclins-Com/active-stories/1.0.0) for endpoints and requirements.

## Testing

To run the tests:

1. Ensure you have run the installation process above.
2. Run `yarn test`

## Assumptions

1. The application can be used from a frontend application or a tool such as `Postman`.
2. While one can login as an admin, an admin can only be seeded or created directly in the database.
3. A rejected story can still be approved and vice versa.
