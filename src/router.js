import React from 'react'
import {Router, Route, Switch} from 'dva/router'
import Layout from 'components/Layout'
import LayoutM from 'components/LayoutM'

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/ent/m">
          <LayoutM />
        </Route>
        <Route path="/">
          <Layout />
        </Route>
      </Switch>
    </Router>
  )
}

export default RouterConfig
