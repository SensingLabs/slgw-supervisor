module.exports = (service, settings) => {
  service.get('/settings/:section', async (req, res) => {
    res.send(await settings.findOne({ section: req.params.section }))
  })
  service.put('/settings/:section', async (req, res) => {
    res.send(
      await settings.updateOne(
        { section: req.query.section },
        { $set: { ...req.body, section: req.params.section } },
        { upsert: true }
      )
    )
  })
}
