const swaggerJSDoc = require('swagger-jsdoc');
const config = require("../Config")
const Routes = require('../Routes');

const swaggerPaths = Routes.reduce((paths, route) => {
    const method = route.method;
    const path = route.path.replace(/:([^/]+)/g, '{$1}');

    paths[path] = {
        [method]: {
            summary: `${route.controller} - ${route.action}`,
            description: `Handler for ${route.controller}.${route.action}`,
            parameters: [],
            responses: {
                200: {
                    description: 'Successful response',
                },
                400: {
                    description: 'Bad request',
                },
                500: {
                    description: 'Internal server error',
                },
            },
        },
    };

    return paths;
}, {});

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: `${config.session.name} Application`,
        },
        servers: [
            {
                url: config.services.Auth,
            },
        ],
        paths: swaggerPaths,
    },
    apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;