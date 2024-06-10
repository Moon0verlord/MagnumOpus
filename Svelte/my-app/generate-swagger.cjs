const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/api/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync('./src/routes/swagger-ui/swagger.json', JSON.stringify(swaggerSpec, null, 2));