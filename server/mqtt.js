const mqtt = require('mqtt')

module.exports = async function(service, db) {
  let settings = db.collection('settings')
  let mqttSettings = await settings.findOne({ section: 'mqtt' })
  if (null != mqttSettings && mqttSettings.mqtturl !== '') {
    let mqttConf = {
      reconnectPeriod: 30000,
      keepalive: 300
    }
    if (mqtt.cert === '') {
      console.log('MQTT certificates present')
      mqttConf.key = mqttSettings.key
      mqttConf.cert = mqttSettings.cert
      mqttConf.ca = [mqttSettings.ca]
    }
    if (mqtt.clientid !== '') {
      mqttConf.clientId = mqttSettings.clientid
      mqttConf.clean = true
    }
    global.mqttClient = mqtt.connect(mqttSettings.mqtturl, mqttConf)
    global.mqttClient.on('error', async () => {
      console.error("MQTT publisher Can't connect, I will retry")
      await settings.updateOne({ section: 'section' }, { $set: { check: false } })
    })

    global.mqttClient.on('connect', async () => {
      console.log('MQTT connected')
      if (mqttSettings.stopic) await global.mqttClient.subscribe(mqttSettings.stopic)
      mqttSettings.check = true
      await settings.updateOne({ _id: mqttSettings._id }, { $set: mqttSettings })
      global.mqttClient.on('message', async (topic, _message) => {
        let message = JSON.parse(_message)
        require('./status')(message, db)
      })
    })
  }
}
