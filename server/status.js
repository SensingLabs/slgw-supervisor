module.exports = async function(message, db) {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  message.timestamp = new Date()
  let _devices = []
  if (message.devices) {
    for (let device of message.devices) {
      let newDevRec = {
        gatewayId: message.gatewayId,
        devEUI: device.devEUI,
        firmwareType: device.firmwareType,
        firmwareVersion: device.firmwareVersion,
        name: device.deviceName
      }
      for (let status of device.status) {
        newDevRec[status.id] = status.value
      }
      await devices.updateOne({ devEUI: device.devEUI }, { $set: newDevRec }, { upsert: true })
      _devices.push(newDevRec)
    }
    message.deviceCount = message.devices.length
    delete message.devices
    await gateways.updateOne({ gatewayId: message.gatewayId }, { $set: message }, { upsert: true })
    message.devices = _devices
  }
  if (1 === global.ws.readyState) {
    global.ws.send(JSON.stringify(message))
  }
  if (message.command) {
    if (message.command.path === '/API/ngrok/start') {
      await gateways.updateOne({ gatewayId: message.gwid }, { $set: { ngrok: message.response.url } })
    }
    if (message.command.path === '/API/ngrok/stop') {
      await gateways.updateOne({ gatewayId: message.gwid }, { $set: { ngrok: '' } })
    }
  }
}
