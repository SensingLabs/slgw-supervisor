const service = require('restana')()
const bodyParser = require('body-parser')
const query = require('qs-middleware')
const MongoClient = require('mongodb')
const cors = require('cors')

let port = 9999

service.use(bodyParser.json())
service.use(query())
service.use(cors())

MongoClient.MongoClient.connect('mongodb://localhost/supervisor', {
  useNewUrlParser: true
}).then(async _db => {
  console.log('Connected successfully to MongoDB server')
  let db = _db.db('supervisor')
  require('./settings')(service, db)
  require('./mqtt')(service, db)
  require('./basics')(service, db)
  await service.start(port)
  console.log(`Restana server started on port ${port}`)
}, console.error)
