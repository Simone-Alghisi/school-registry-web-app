# projectSe2group06

## Run

Install npm dependencies

```bash=
npm install
```

Transpile TypeScript code and run the application

```bash=
npm run build
npm run start
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

## Project structure

```
projectSe2group06
├── lib
│   ├── app.ts
│   ├── common
│   │   ├── controllers
│   │   │   └── common.controller.ts
│   │   ├── interfaces
│   │   │   ├── configureRoutes.interface.ts
│   │   │   └── crud.interface.ts
│   │   └── routes
│   │       └── common.routes.ts
│   ├── controllers
│   │   └── user.controller.ts
│   ├── db
│   │   ├── data
│   │   │   └── user.json
│   │   └── db.ts
│   ├── middlewares
│   │   └── user.middleware.ts
│   ├── models
│   │   └── user.model.ts
│   ├── routes
│   │    └── user.route.ts
├── package.json
├── package-lock.json
├── Procfile
├── public
│   ├── css
│   │   └── style.css
│   ├── insertUser.html
│   ├── js
│   │   └── main.js
│   └── users.html
├── README.md
├── spec
│   ├── app.spec.ts
│   ├── common
│   │   └── routes
│   │       └── common.routes.spec.ts
│   ├── controllers
│   │   └── user.controller.spec.ts
│   ├── models
│   │   └── user.model.spec.ts
│   └── routes
│       └── user.route.ts
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
