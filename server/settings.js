module.exports = (service, db) => {
  let settings = db.collection('settings')
  service.get('/settings/:section', async (req, res) => {
    let ret = await settings.findOne({ section: req.params.section })
    if (null == ret) {
      await settings.insertOne({ section: req.params.section, check: false })
    }
    res.send(ret)
  })
  service.put('/settings/:section', async (req, res) => {
    require('./mqtt')(service, db)
    res.send(
      await settings.updateOne({ section: req.params.section }, { $set: { ...req.body, section: req.params.section } })
    )
  })
}
