module.exports = async function(service, db) {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  service.get('/data/gateways', async (req, res) => {
    res.send(await gateways.find().toArray())
  })
  service.get('/data/devices', async (req, res) => {
    res.send(await devices.find().toArray())
  })
}
