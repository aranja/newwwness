import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/layout'
import Home from './components/home'

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
  </Route>
)

export default routes
