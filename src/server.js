// ----------------------------------------------
// Neighbourhood Backend Node.js with Express.js
// Authors: Rowan and Ian
// Date: Dec 2022
// ----------------------------------------------

const { sequelize } = require("./db/connection");
const express = require("express");

// swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Neighbourhood Backend",
            description:
                "The Neighbourhood App Backend API",
            contact: {
                name: "Rowan / Ian",
            },
            servers: ["http://localhost:5000"],
        },
    },
    // ['.routes/*.js']
    apis: [

        "src/school/schoolRoutes.js",
        "src/user/userRoutes.js",
        "src/auth/authRoutes.js",

        "src/server.js",
    ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// routes

const userRouter = require("./user/userRoutes");
const authRouter = require("./auth/authRoutes");
const schoolRouter = require("./school/schoolRoutes");


// sequelize
const syncTables = async () => {
    sequelize.sync();
};

syncTables();

// server config
const port = process.env.PORT || 5001;
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(userRouter);
app.use(authRouter);
app.use(schoolRouter);


app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);

// health manager route
app.get("/health", (request, response) => {
    response
        .status(200)
        .send({ message: "API is working" });
});

// start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
