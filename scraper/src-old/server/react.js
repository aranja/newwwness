import Express from 'express'
import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { RouterContext, match } from 'react-router'
import Html from './html'
import routes from '../routes'

const server = new Express()

server.get('*', (req, res) => {
  match({ routes, location: req.url }, (error, redirect, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
      return
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
      return
    } else if (!renderProps) {
      res.status(404).send('Not found')
    }

    const content = renderToString(<RouterContext {...renderProps} />)
    const markup = renderToStaticMarkup(
      <Html content={content} />
    )

    res.send('<!doctype html>' + markup)
  })
})

export default server
