module.exports = async function(service, db) {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  let mqttSettings = await db.collection('settings').findOne({ section: 'mqtt' })
  service.get('/data/gateways', async (req, res) => {
    let gws = await gateways.find().toArray()
    for (let gw in gws) {
      gws[gw].devices = await devices.find({ gatewayId: gws[gw].gatewayId }).toArray()
    }
    res.send(gws)
  })
  service.put('/start/ngrok/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'POST', path: '/API/ngrok/start' }]
      })
    )
    res.end()
  })
  service.put('/stop/ngrok/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'POST', path: '/API/ngrok/stop' }]
      })
    )
    res.end()
  })
  service.put('/save/ngrok/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [
          {
            method: 'POST',
            path: '/API/ngrok/save',
            body: {
              ngroktoken: req.query.ngroktoken
            }
          }
        ]
      })
    )
    res.end()
  })
  service.put('/start/vpn/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'PUT', path: '/API/systemctl/openvpn/start' }]
      })
    )
    res.end()
  })
  service.put('/stop/vpn/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'PUT', path: '/API/systemctl/openvpn/stop' }]
      })
    )
    res.end()
  })
  service.put('/start/custom/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'PUT', path: '/API/systemctl/customvpn/start' }]
      })
    )
    res.end()
  })
  service.put('/stop/custom/:gwid', (req, res) => {
    global.mqttClient.publish(
      mqttSettings.ctopic,
      JSON.stringify({
        gwid: req.params.gwid,
        commands: [{ method: 'PUT', path: '/API/systemctl/customvpn/stop' }]
      })
    )
    res.end()
  })

  service.get('/data/devices', async (req, res) => {
    res.send(await devices.find().toArray())
  })
}
