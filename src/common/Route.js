import React from 'react'
import {Route, Switch} from 'dva/router'

import Talents from 'routes/talent'
import Resumes from 'routes/resume'
import Recommends from 'routes/recommend'
import Positions from 'routes/position'
import CreatePosition from 'routes/position/create'
import ModifyPosition from 'routes/position/modify'

const myRoute = () => {
  return (
    <Switch>
      <Route path="/" exact component={Talents} />
      <Route path="/talents" exact component={Talents} />
      <Route path="/resumes" exact component={Resumes} />
      <Route path="/recommends" exact component={Recommends} />
      <Route path="/positions" exact component={Positions} />
      <Route path="/ent" exact component={Talents} />
      <Route path="/ent/talents" exact component={Talents} />
      <Route path="/ent/resumes" exact component={Resumes} />
      <Route path="/ent/recommends" exact component={Recommends} />
      <Route path="/ent/positions" exact component={Positions} />
      <Route path="/ent/positions/create" exact component={CreatePosition} />
      <Route
        path="/ent/positions/modify/:id"
        exact
        component={ModifyPosition}
      />
    </Switch>
  )
}

export default myRoute
