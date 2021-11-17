const PouchDB = require('pouchdb')
const find = require('pouchdb-find')

PouchDB.plugin(find);

const dbUrl = 'https://f42b3b75-48ce-462c-b241-5cf6767080b1-bluemix.cloudantnosqldb.appdomain.cloud/mathfunapi'
exports.api = new PouchDB(dbUrl, { skip_setup: true })
