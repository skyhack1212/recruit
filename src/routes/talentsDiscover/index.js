import React from 'react'
import {Tabs} from 'antd'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import * as R from 'ramda'

import ContentSider from 'components/Layout/ContentSider'
import TalentAdvancedSearch from 'components/Talent/AdvancedSearch'
import RecommendAdvancedSearch from 'components/Recommend/AdvancedSearch'
import ApplicantAdvancedSearch from 'components/Applicant/AdvancedSearch'

import Search from './Search'
import Recommend from './Recommend'
import Applicant from './Applicant'

import styles from './index.less'

const {TabPane} = Tabs

const tagAdvancedSearch = {
  search: TalentAdvancedSearch,
  recommend: RecommendAdvancedSearch,
  applicant: ApplicantAdvancedSearch,
}

const initialState = {
  search: {
    city: '北京',
    work_time: -1,
    degree: -1,
    company_level: -1,
    is_211_985: 0,
  },
  recommend: {
    work_time: -1,
    degree: -1,
  },
  applicant: {
    filter: [],
  },
}

class Index extends React.Component {
  constructor(props) {
    super(props)
    const {tab} = props.match.params
    this.state = {
      tab,
      advancedSearch: R.propOr({}, tab, initialState),
    }
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
        <div key="content" className={styles.discoverMain}>
          <Tabs
            tabPosition="left"
            activeKey={this.state.tab}
            onChange={this.handleTabChange}
          >
            <TabPane
              tab={<Link to="/ent/talents/discover/search">人才搜索</Link>}
              key="search"
              activeclassname="active"
            >
              <Search advancedSearch={advancedSearch} />
            </TabPane>
            <TabPane
              tab={<Link to="/ent/talents/discover/recommend">人才推荐</Link>}
              key="recommend"
              activeclassname="active"
            >
              <Recommend advancedSearch={advancedSearch} />
            </TabPane>
            <TabPane
              tab={<Link to="/ent/talents/discover/applicant">主动投递</Link>}
              key="applicant"
              activeclassname="active"
            >
              <Applicant advancedSearch={advancedSearch} />
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
