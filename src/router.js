import React from 'react'
import {Router} from 'dva/router'
import Layout from 'components/Layout'

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Layout />
    </Router>
  )
}

export default RouterConfig
