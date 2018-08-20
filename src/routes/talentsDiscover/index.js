import React from 'react'
import {Menu} from 'antd'
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

const advancedSearchCompMap = {
  search: TalentAdvancedSearch,
  recommend: RecommendAdvancedSearch,
  applicant: ApplicantAdvancedSearch,
}

const contentCompMap = {
  search: Search,
  recommend: Recommend,
  applicant: Applicant,
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

  componentWillReceiveProps(newProps) {
    const {tab} = newProps.match.params
    this.setState({
      tab,
      advancedSearch: R.propOr({}, tab, initialState),
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
    const {tab, advancedSearch} = this.state
    const AdvancedSearchPanel = advancedSearchCompMap[tab]
    const Content = contentCompMap[tab]
    return (
      <ContentSider key="content">
        <div key="content" className={styles.discoverMain}>
          <Menu style={{width: 200}} defaultSelectedKeys={[tab]} mode="inline">
            <Menu.Item key="search">
              <Link to="/ent/talents/discover/search">搜索人才</Link>
            </Menu.Item>
            <Menu.Item key="recommend">
              <Link to="/ent/talents/discover/recommend">人才推荐</Link>
            </Menu.Item>
            <Menu.Item key="applicant">
              <Link to="/ent/talents/discover/applicant">主动投递</Link>
            </Menu.Item>
          </Menu>
          <div className={styles.discoverContent}>
            <Content advancedSearch={advancedSearch} />
          </div>
          {/* 
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
          */}
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
