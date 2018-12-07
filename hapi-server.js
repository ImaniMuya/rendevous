// Standard Node modules path

const Path = require("path");

// Knex
const knex = require("knex")({
    client: "pg",
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "imani_muya",
        user: "imani_muya",
        password: "yupatequ"
    }
});

// Hapi
const Joi = require("joi"); // Input validation
const Hapi = require("hapi"); // Server

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "dist")
        }
    }
});

async function init() {
    // Show routes at startup.
    await server.register(require("blipp"));

    // Output logging information.
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true
        }
    });

    // Configure static file service.
    await server.register(require("inert"));

    // Configure routes.
    server.route([
        {
            method: "POST",
            path: "/api/members",
            config: {
                description: "Sign up for an account",
                validate: {
                    payload: {
                        firstName: Joi.string().required(),
                        lastName: Joi.string().required(),
                        userName: Joi.string().required(),
                        email: Joi.string()
                            .email()
                            .required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("members")
                    .select()
                    .where("email", request.payload.email);
                if (resultSet.length > 0) {
                    return {
                        ok: false,
                        msge: `The account '${request.payload.email}' is already in use`
                    };
                }

                let result = await knex("members").insert({
                    firstname: request.payload.firstName,
                    lastname: request.payload.lastName,
                    username: request.payload.userName,
                    email: request.payload.email,
                    password: request.payload.password
                });

                if (result.rowCount === 1) {
                    return {
                        ok: true,
                        msge: `Created account '${request.payload.userName}'`
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't add '${
                            request.payload.email
                        }' to the database`
                    };
                }
            }
        },
        {
            method: "GET",
            path: "/api/members",
            config: {
                description: "Retrieve all members"
            },
            handler: async (request, h) => {
                return knex("members").select("email", "username","firstname", "lastname");
            }
        },
        {
            method: "POST",
            path: "/api/teams",
            config: {
                description: "Create Team",
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        description: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("teams")
                    .select()
                    .where("name", request.payload.name);
                if (resultSet.length > 0) {
                    return {
                        ok: false,
                        msge: `The team name '${request.payload.name}' is already in use`
                    };
                }

                let result = await knex("teams").insert({
                    name: request.payload.name,
                    description: request.payload.description,
                });

                if (result.rowCount === 1) {
                    return {
                        ok: true,
                        msge: `Created team '${request.payload.name}'`
                    };
                } else {
                    return {
                        ok: false,
                        msge: `Couldn't add '${
                            request.payload.team
                        }' to the database`
                    };
                }
            }
        },
        {
            method: "GET",
            path: "/api/teams",
            config: {
                description: "Retrieve all teams"
            },
            handler: async (request, h) => {
                return knex("teams").select("name");
            }
        },
        {
            method: "GET",
            path: "/{param*}",
            config: {
                description: "Production Application"
            },
            handler: {
                directory: {
                    path: ".",
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    ]);

    // Start the server.
    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

// Go!
init();
