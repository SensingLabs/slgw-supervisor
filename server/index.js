const service = require('restana')()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb')

service.use(bodyParser.json())
MongoClient.MongoClient.connect(
  'mongodb://localhost',
  {
    useNewUrlParser: true
  }
).then(client => {
  console.log('Connected successfully to MongoDB server')
  global.settings = client.db('supervisor').collection('settings')
}, console.error)

service.start(8000)
