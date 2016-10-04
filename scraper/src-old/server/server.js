import Express from 'express'
import compression from 'compression'
import api from './api'
import react from './react'

const server = new Express()
server.use(compression())
server.use(api)
server.use(react)

server.listen(8080)
