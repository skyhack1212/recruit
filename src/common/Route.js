import React from 'react'
import {Route, Switch} from 'dva/router'

import Talents from 'routes/talent'
import Resumes from 'routes/resume'

const myRoute = () => {
  return (
    <Switch>
      <Route path="/" exact component={Talents} />
      <Route path="/talents" exact component={Talents} />
      <Route path="/resumes" exact component={Resumes} />
      <Route path="/ent" exact component={Talents} />
      <Route path="/ent/talents" exact component={Talents} />
      <Route path="/ent/resumes" exact component={Resumes} />
    </Switch>
  )
}

export default myRoute
