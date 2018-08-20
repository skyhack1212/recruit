import React from 'react'
import {Tabs} from 'antd'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import * as R from 'ramda'

import ContentSider from 'components/Layout/ContentSider'
import FollowingAdvancedSearch from 'components/Flowing/AdvancedSearch'
import InterviewAdvancedSearch from 'components/Interview/AdvancedSearch'

import Following from './Following'
import Interview from './Interview'

import styles from './index.less'

const {TabPane} = Tabs

const tagAdvancedSearch = {
  following: FollowingAdvancedSearch,
  interview: InterviewAdvancedSearch,
}

const initialSearch = {
  following: {
    category: ['hasResume', 'noResume'],
    source: ['search', 'recommend', 'delivery'],
  },
  interview: {
    work_time: -1,
    degree: -1,
  },
}

class Index extends React.Component {
  constructor(props) {
    super(props)
    const {tab = 'following'} = props.match.params
    this.state = {
      tab,
      advancedSearch: R.propOr({}, tab, initialSearch),
    }
  }

  componentWillReceiveProps(newProps) {
    const {tab} = newProps.match.params
    this.setState({
      tab,
      advancedSearch: R.propOr({}, tab, initialSearch),
    })
  }

  handleTabChange = tab => {
    this.setState({
      tab,
    })
  }

  handleChangeAdvancedSearch = advancedSearch => {
    this.setState({
      advancedSearch,
    })
  }

  render() {
    const AdvancedSearchPanel = tagAdvancedSearch[this.state.tab]
    const {advancedSearch} = this.state
    return (
      <ContentSider key="content">
        <div key="content" className={styles.followTalentMain}>
          <Tabs
            tabPosition="left"
            activeKey={this.state.tab}
            onChange={this.handleTabChange}
          >
            <TabPane
              tab={<Link to="/ent/talents/admin/following">沟通中</Link>}
              key="following"
              activeclassname="active"
            >
              <Following advancedSearch={advancedSearch} />
            </TabPane>
            <TabPane
              tab={<Link to="/ent/talents/admin/interview">待约面</Link>}
              key="interview"
              activeclassname="active"
            >
              <Interview advancedSearch={advancedSearch} />
            </TabPane>
          </Tabs>
        </div>
        <div key="sider">
          <AdvancedSearchPanel
            onChange={this.handleChangeAdvancedSearch}
            data={this.state.advancedSearch}
          />
        </div>
      </ContentSider>
    )
  }
}

export default connect()(Index)
