const PouchDB = require('pouchdb')
const find = require('pouchdb-find')

PouchDB.plugin(find);

const dbUrl = 'database-url'
exports.api = new PouchDB(dbUrl, { skip_setup: true })
