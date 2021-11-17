const cors = require('cors');
const express = require('express');
const api = require('./datasource');
const bodyParser = require('body-parser')
const SwaggerUi = require('swagger-ui-express');

const server = express();
const SwaggerDocument = require('./swagger.json');

server.use(cors());
server.use(bodyParser.json());
server.set('port', process.env.PORT || 3000);

require('./modules/guess').initNumberGuess(server, api.api);
require('./modules/arithmetic').initArithmetics(server, api.api);
require('./modules/baseconversion').initBaseConversion(server, api.api);

server.use('/', SwaggerUi.serve, SwaggerUi.setup(SwaggerDocument, { explorer: true }));

server.listen(server.get('port'), function () {
  console.log('Server running at http://localhost:' +server.get('port'))
})
