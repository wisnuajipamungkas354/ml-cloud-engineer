'use strict';
import dotenv from 'dotenv';
import Hapi from '@hapi/hapi';
import loadModel from './src/loadModel.js';
import routes from './src/routes.js';
import ClientError from './exceptions/ClientError.js';

dotenv.config();
 
(async () => {
  // initializing HTTP server
  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
    routes: {
        cors: {
          origin: ['*'],
        },
    },
  });

  // load and get machine learning model
  const model = await loadModel();
  server.app.model = model;
  console.log('model loaded!');

  // server routes
  server.route(routes);

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;
    if (response instanceof ClientError) {
        const newResponse = h.response({
            status: 'fail',
            message: response.message
        })
        newResponse.code(response.statusCode);
        return newResponse;
    }

    if (response.isBoom) {
        const newResponse = h.response({
            status: 'fail',
            message: "Payload content length greater than maximum allowed: 1000000"
        })
        newResponse.code(413)
        return newResponse;
    }

    return h.continue;
});
 
  // running server
  await server.start();
 
  console.log(`Server start at: ${server.info.uri}`);
})();