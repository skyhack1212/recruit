import React from 'react'
import {Route, Switch} from 'dva/router'

// import Talents from 'routes/talent'
// import Resumes from 'routes/resume'
// import Recommends from 'routes/recommend'
import TalentsDiscover from 'routes/talentsDiscover'
import TalentsAdmin from 'routes/talentsAdmin'
import Positions from 'routes/position'
import CreatePosition from 'routes/position/create'
import ModifyPosition from 'routes/position/modify'

const myRoute = () => {
  return (
    <Switch>
      <Route path="/" exact component={Positions} />

      <Route
        path="/ent/talents/discover/:tab"
        exact
        component={TalentsDiscover}
      />

      <Route path="/ent/talents/admin/:tab" exact component={TalentsAdmin} />

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
