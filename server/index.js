const service = require('express')()
const bodyParser = require('body-parser')
const query = require('qs-middleware')
const MongoClient = require('mongodb')
const cors = require('cors')
require('express-ws')(service)

let port = 9999

service.use(bodyParser.json())
service.use(query())
service.use(cors())
service.use(require('express').static('dist'))

MongoClient.MongoClient.connect('mongodb://localhost/supervisor', {
  useNewUrlParser: true
}).then(async _db => {
  console.log('Connected successfully to MongoDB server')
  let db = _db.db('supervisor')
  require('./settings')(service, db)
  require('./mqtt')(service, db)
  require('./basics')(service, db)
  global.ws = { readyState: 0 }
  service.ws('/', function(ws, req) {
    global.ws = ws
  })

  await service.listen(port)
  console.log(`Restana server started on port http://localhost:${port}`)
}, console.error)
