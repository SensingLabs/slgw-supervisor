const service = require('restana')()
const bodyParser = require('body-parser')
const query = require('qs-middleware')
const MongoClient = require('mongodb')
const cors = require('cors')

let port = 8888

service.use(bodyParser.json())
service.use(query())
service.use(cors())

MongoClient.MongoClient.connect('mongodb://localhost', {
  useNewUrlParser: true
}).then(async client => {
  console.log('Connected successfully to MongoDB server')
  let settings = client.db('supervisor').collection('settings')
  require('./settings')(service, settings)
  await service.start(port)
  console.log(`Restana server started on port ${port}`)
}, console.error)
