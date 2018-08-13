import React from 'react'
import {Router} from 'dva/router'
import LayoutM from 'components/LayoutM'

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <LayoutM />
    </Router>
  )
}

export default RouterConfig
