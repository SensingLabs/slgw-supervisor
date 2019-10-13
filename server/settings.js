module.exports = (service, db) => {
  let gateways = db.collection('gateways')
  let devices = db.collection('devices')
  let settings = db.collection('settings')
  service.get('/settings/:section', async (req, res) => {
    let ret = await settings.findOne({ section: req.params.section })
    if (null == ret) {
      await settings.insertOne({ section: req.params.section, check: false })
    }
    res.send(ret)
  })
  service.put('/settings/:section', async (req, res) => {
    await settings.updateOne(
      { section: req.params.section },
      { $set: { ...req.body, section: req.params.section } }
    )
    require('./mqtt')(service, db)
    res.end()
  })
  service.delete('/data', async (req, res) => {
    await gateways.drop()
    await devices.drop()
    res.end()
  })
}
