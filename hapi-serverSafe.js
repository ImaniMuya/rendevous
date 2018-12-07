// Standard Node modules
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
                        username: Joi.string().required(),
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
                    username: request.payload.username,
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
                            request.payload.username
                        }' to the database`
                    };
                }
            }
        },
        // {
        //     method: "POST",
        //     path: "/api/accounts",
        //     config: {
        //         description: "Login to existing account",
        //         validate: {
        //             payload: {
        //                 email: Joi.string()
        //                     .email()
        //                     .required(),
        //                 password: Joi.string().required()
        //             }
        //         }
        //     },
        //     handler: async (request, h) => {
        //         let resultSet = await knex("accounts")
        //             .select()
        //             .where("email", request.payload.email)
        //             .where("password",request.payload.password);
        //         if (resultSet.length === 1) {
        //             //set login variable to be you. 
        //             return {
        //                 ok: true,
        //                 msge: `Welcome '${request.payload.email}' you have logged in`
        //             }
        //         } else {
        //             return {
        //                 ok: false,
        //                 msge: `Couldn't find account '${
        //                     request.payload.email
        //                 }'. Do you need to create an account?`
        //             };
        //         };
        //     }
        // },
        {
            method: "GET",
            path: "/api/accounts",
            config: {
                description: "Retrieve all accounts"
            },
            handler: async (request, h) => {
                return knex("accounts").select("email", "firstname", "lastname");
            }
        },
        {
            method: "GET",
            path: "/api/teams",
            config: {
                description: "Retrieve all teams"
            },
            handler: async (request, h) => {
                return knex("accounts").select("name");
            }
        },
        {
            method: "POST",
            path: "/api/teams",
            config: {
                description: "Create a Team",
                validate: {
                    payload: {
                        team: Joi.string().required(),
                    }
                }
            },
            handler: async (request, h) => {
                let resultSet = await knex("teams")
                    .select()
                    .where("teams", request.payload.team);
                if (resultSet.length > 0) {
                    return {
                        ok: false,
                        msge: `The team '${request.payload.email}' is already created, would you like to join?`
                    };
                }

                let result = await knex("teams").insert({
                    team: request.payload.team,
                    //insert yourself as member??
                });

                if (result.rowCount === 1) {
                    return {
                        ok: true,
                        msge: `Created team '${request.payload.team}'`
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
        // //adding member 
        // {
        //     method: 'PUT',
        //     path: '/api/member',
        //     config: {
        //         description: 'add member',
        //         validate: {
        //             params: {
        //                 member_id: Joi.number().integer().min(0)
        //             },
        //             payload: {
        //                 fname: Joi.string().min(1).required(),
        //                 lname: Joi.string().min(1).required(),
        //                 password: Joi.string().min(1).required(),
        //                 email: Joi.string().min(1).required(),
        //             }
        //         }
        //     },
        //     handler: async (request, h) => {
        //     }
        // },
        // //create commitment
        // {
        //     method: 'PUT',
        //     path: '/api/commitment',
        //     config: {
        //         description: 'add commitment',
        //         validate: {
        //             params: {
        //                 commitment_id: Joi.number().integer().min(0)
        //             },
        //             payload: {
        //                 name: Joi.string().min(1).required(),
        //                 description: Joi.string().min(1),
        //                 location: Joi.string().min(1).required(),
        //                 startDateTime: Joi.string().min(1).required(),
        //                 endDateTime: Joi.string().min(1).required(),
        //                 numWeeks: Joi.string().min(1).required(),
        //             }
        //         }
        //     },
        //     handler: async (request, h) => {
        //     }
        // },
        // //create activity
        // {
        //     method: 'PUT',
        //     path: '/api/activity',
        //     config: {
        //         description: 'add activity',
        //         validate: {
        //             params: {
        //                 activity_id: Joi.number().integer().min(0)
        //             },
        //             payload: {
        //                 name: Joi.string().min(1).required(),
        //                 description: Joi.string().min(1),
        //                 location: Joi.string().min(1).required(),
        //                 duration: Joi.string().min(1).required(),
        //             }
        //         }
        //     },
        //     handler: async (request, h) => {
        //     }
        // }
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
