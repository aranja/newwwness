import Express from 'express'
import { queryHotLinks } from './bookshelf'

const api = new Express()

api.get('/api/links', async (req, res) => {
  const links = await queryHotLinks()
  res.json(links)
})

export default api
