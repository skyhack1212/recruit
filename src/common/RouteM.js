import React from 'react'
import {Route, Switch} from 'dva/router'

import PositionPreview from 'routes/position/Preview'

const myRoute = () => {
  return (
    <Switch>
      <Route path="/ent/m" exact component={PositionPreview} />
      <Route path="/ent/m/position/preview" exact component={PositionPreview} />
    </Switch>
  )
}

export default myRoute
