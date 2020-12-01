# projectSe2group06

![Deploy](https://github.com/Simone-Alghisi/projectSe2group06/workflows/Deploy/badge.svg)

## Get started with projectSe2group06

Clone the repository on your machine

```bash=
git clone https://github.com/Simone-Alghisi/projectSe2group06.git
```

Move inside the `projectSe2group06` folder

```bash=
cd projectSe2group06
```

Install npm dependencies and transpile the TypeScript code

```bash=
npm install
```

Create the `.env` containing the environment variables defined in the `.env.sample` file.

An example of the file is the following

```bash=
PORT=8080
MONGODB_URI=mongodb://[username:password@]127.0.0.1:27017/db
JWT_SECRET=<jwt access token secret>
JWT_REFRESH_SECRET=<jwt refresh token secret>
```

## Run the application

Run the following command inside the `projectSe2group06` folder

```bash=
npm run start
```

## Test

Tests are implemented using [Mocha](https://mochajs.org/) test framework.

Notice that, at the moment, tests will affect the database specified by the `MONGODB_URI` contained in the `.env` file

They can be run using the following command

```bash=
npm run test
```

## Typedoc

If you have not done it yet, install npm dependecies

```bash=
npm install
```

Generate the documentation

```bash=
npm run typedoc
```

The documentation will be available in the `doc` folder generated by Typedoc.

## Project structure

```
projectSe2group06
├── lib
│   ├── app.ts
│   ├── common
│   │   ├── interfaces
│   │   │   ├── configureRoutes.interface.ts
│   │   │   ├── crudController.interface.ts
│   │   │   └── crudService.interface.ts
│   │   ├── middlewares
│   │   │   └── common.middleware.ts
│   │   ├── models
│   │   │   └── common.model.ts
│   │   ├── routes
│   │   │   └── common.routes.ts
│   │   └── services
│   │       └── mongoose.service.ts
│   ├── controllers
│   │   ├── class.controller.ts
│   │   ├── login.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares
│   │   ├── class.middleware.ts
│   │   ├── jwt.middleware.ts
│   │   ├── login.middleware.ts
│   │   └── user.middleware.ts
│   ├── models
│   │   ├── class.model.ts
│   │   └── user.model.ts
│   ├── routes
│   │   ├── class.route.ts
│   │   ├── login.route.ts
│   │   └── user.route.ts
│   └── services
│       ├── class.service.ts
│       └── user.service.ts
├── package.json
├── package-lock.json
├── Procfile
├── public
│   ├── classes.html
│   ├── css
│   │   └── style.css
│   ├── editClass.html
│   ├── editUser.html
│   ├── forbidden.html
│   ├── home.html
│   ├── index.html
│   ├── insertClass.html
│   ├── insertUser.html
│   ├── js
│   │   ├── classes.js
│   │   ├── common.js
│   │   ├── deleteClass.js
│   │   ├── deleteUser.js
│   │   ├── editClass.js
│   │   ├── editUser.js
│   │   ├── index.js
│   │   ├── insertClass.js
│   │   ├── insertUser.js
│   │   ├── main.js
│   │   ├── plugins
│   │   │   └── datatables.js
│   │   └── users.js
│   ├── serverError.html
│   └── users.html
├── README.md
├── spec
│   ├── app.spec.ts
│   ├── common
│   │   └── routes
│   │       └── common.routes.spec.ts
│   ├── controllers
│   │   ├── class.controller.spec.ts
│   │   ├── login.controller.spec.ts
│   │   └── user.controller.spec.ts
│   ├── models
│   │   ├── class.model.spec.ts
│   │   └── user.model.spec.ts
│   ├── routes
│   │   ├── login.route.ts
│   │   └── user.route.ts
│   └── spec_helper.ts
├── swagger.yaml
└── tsconfig.json
```

## Team 

|  Name    |  Surname   |     Github          |  Matricola |
| :-----:  | :--------: | :-----------------: | :--------: |
| Emanuele | Beozzo     | `emanuelebeozzo`    | **201637** |
| Massimo  | Rizzoli    | `massimo-rizzoli`   | **202691** |
| Samuele  | Bortolotti | `samuelebortolotti` | **201647** |
| Simone   | Alghisi    | `Simone-Alghisi`    | **202077** |
