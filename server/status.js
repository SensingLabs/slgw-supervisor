module.exports = async function(message, db) {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  message.timestamp = new Date()
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
  }
  message.deviceCount = message.devices.length
  delete message.devices
  await gateways.updateOne({ gatewayId: message.gatewayId }, { $set: message }, { upsert: true })
}
