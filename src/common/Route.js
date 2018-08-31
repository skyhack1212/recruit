import React from 'react'
import {Route, Switch} from 'dva/router'

// import Talents from 'routes/talent'
// import Resumes from 'routes/resume'
// import Recommends from 'routes/recommend'
// import TalentsDiscover from 'routes/talentsDiscover'

import Positions from 'routes/position'
import CreatePosition from 'routes/position/create'
import ModifyPosition from 'routes/position/modify'

import TalentsDiscoverSearch from 'routes/talentsDiscover/Search'
import TalentsDiscoverRecommend from 'routes/talentsDiscover/Recommend'

import TalentsFollowApplicant from 'routes/talentsFollow/Applicant'
import TalentsFollowCommunication from 'routes/talentsFollow/Communication'
import TalentsFollowInterview from 'routes/talentsFollow/Interview'
import TalentsFollowRejected from 'routes/talentsFollow/Rejected'

import TalentPoolList from 'routes/talentPool'

// import StaffList from 'routes/account/Staff'
// import Rights from 'routes/account/Rights'

const myRoute = () => {
  return (
    <Switch>
      <Route path="/ent" exact component={Positions} />

      {/* 发现人才  */}
      <Route
        path="/ent/talents/discover/search"
        exact
        component={TalentsDiscoverSearch}
      />
      <Route
        path="/ent/talents/discover/recommend"
        exact
        component={TalentsDiscoverRecommend}
      />

      {/*  跟进人才  */}
      <Route
        path="/ent/talents/follow/applicant"
        exact
        component={TalentsFollowApplicant}
      />
      <Route
        path="/ent/talents/follow/communication"
        exact
        component={TalentsFollowCommunication}
      />
      <Route
        path="/ent/talents/follow/interview"
        exact
        component={TalentsFollowInterview}
      />
      <Route
        path="/ent/talents/follow/rejected"
        exact
        component={TalentsFollowRejected}
      />

      {/*  职位管理 */}
      <Route path="/ent/positions" exact component={Positions} />
      <Route path="/ent/positions/create" exact component={CreatePosition} />
      <Route
        path="/ent/positions/modify/:id"
        exact
        component={ModifyPosition}
      />

      {/* 人才库 */}
      <Route path="/ent/talents/pool" exact component={TalentPoolList} />

      {/*  账户管理  */}
      {/* <Route path="/ent/account/staff" exact component={StaffList} /> */}
      {/* <Route path="/ent/account/rights" exact component={Rights} /> */}
    </Switch>
  )
}

export default myRoute
