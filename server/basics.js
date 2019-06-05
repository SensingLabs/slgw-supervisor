module.exports = async function(service, db) {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  service.get('/data/gateways', async (req, res) => {
    let gws = await gateways.find().toArray()
    for (let gw in gws) {
      gws[gw].devices = await devices.find({ gatewayId: gws[gw].gatewayId }).toArray()
    }
    res.send(gws)
  })
  service.get('/data/devices', async (req, res) => {
    res.send(await devices.find().toArray())
  })
}
