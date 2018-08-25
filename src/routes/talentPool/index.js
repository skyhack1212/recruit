import React from 'react'
import {Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import AdvancedSearch from 'components/TalentsFollow/Interview/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentPool/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './index.less'

@connect(state => ({
  loading: state.loading.models.resumes,
  jobs: state.global.jobs,
}))
export default class TalentPool extends React.Component {
  state = {
    data: [],
    remain: 0,
    page: 0,
    selectedIds: [],
    advancedSearch: {
      work_time: -1,
      degree: -1,
    },
  }

  componentWillMount() {
    this.refreshData()
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  empty = () => {}

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )

  refreshData = () =>
    this.loadData().then(data => {
      this.setState({
        data: data.contacts,
        remain: data.remain,
      })
    })

  appendData = () =>
    this.loadData().then(data => {
      this.setState({
        data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.contacts]),
        remain: data.remain,
      })
    })

  loadData = () => {
    return this.props.dispatch({
      type: 'talentPool/fetch',
      payload: {
        page: this.state.page,
      },
    })
  }

  showOperateSuccess = () => {
    message.success('操作成功')
    this.refreshData()
  }

  handleSelect = id => selected => {
    const {selectedIds} = this.state
    this.setState({
      selectedIds: selected
        ? [...selectedIds, id]
        : R.without([id], selectedIds),
    })
  }

  handleSelectAll = e => {
    this.setState({
      selectedIds: e.target.checked ? this.getAllIds() : [],
    })
  }

  handleChatting = uid => e => {
    e.stopPropagation()
    window.open(`https://maimai.cn/im?target=${uid}`, '脉脉聊天')
  }

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  renderTalentItem = item => {
    const {selectedIds} = this.state
    const {id} = item
    const buttons = [
      <Button
        key="communication"
        onClick={this.handleChatting(item.uid || item.id)}
        className={styles.operation}
      >
        脉脉沟通
      </Button>,
    ]
    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showSource
        buttons={buttons}
      />
    )
  }

  renderList = () => <div>{this.state.data.map(this.renderTalentItem)}</div>

  render() {
    const {loading = false} = this.props
    const {data, remain, advancedSearch} = this.state
    return (
      <Layout>
        <Menu activeMenu="list" key="menu" />
        <div key="content">
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            dataLength={data.length}
            remain={remain}
            key="list"
            search="flowing"
          />
        </div>
        <Sider key="sider">
          <AdvancedSearch
            data={advancedSearch}
            onChange={this.handleAdvancedSearchChange}
          />
        </Sider>
      </Layout>
    )
  }
}
