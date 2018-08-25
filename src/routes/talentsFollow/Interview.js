import React from 'react'
import {Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import JobSelect from 'components/Common/JobSelect'
import AdvancedSearch from 'components/TalentsFollow/Interview/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsFollow/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './interview.less'

@connect(state => ({
  loading: state.loading.models.resumes,
  jobs: state.global.jobs,
}))
export default class Interview extends React.Component {
  state = {
    data: [],
    remain: 0,
    page: 0,
    jid: '',
    selectedIds: [],
    advancedSearch: {
      work_time: -1,
      degree: -1,
    },
  }

  componentWillMount() {
    this.refreshData()
    this.fetchJobs()
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  empty = () => {}

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

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
        data: data.list,
        remain: data.remain,
      })
    })

  appendData = () =>
    this.loadData().then(data => {
      this.setState({
        data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.list]),
        remain: data.remain,
      })
    })

  loadData = () => {
    const jidParam = this.state.jid ? {jid: this.state.jid} : {}
    return this.props.dispatch({
      type: 'resumes/fetch',
      payload: {
        ...jidParam,
        page: this.state.page,
        state: 'interview',
        source: 'delivery,search,recommend',
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

  handleChangeJob = jid =>
    this.setState({jid, selectedIds: [], page: 0, data: []}, this.refreshData)

  handleChatting = uid => e => {
    e.stopPropagation()
    window.open(`https://maimai.cn/im?target=${uid}`, '脉脉聊天')
  }

  handleModifyState = (talentId, state) => () => {
    this.props.dispatch({
      type: 'talents/modifyState',
      payload: {
        to_uids: talentId,
        state,
      },
    })
  }

  handleBatchModifyState = state => () => {
    this.props.dispatch({
      type: 'talents/modifyState',
      payload: {
        to_uids: this.state.selectedIds.join(','),
        state,
      },
    })
  }

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  renderSearch = () => {
    return (
      <div className={styles.search}>
        <span className={styles.searchPosition}>
          <JobSelect
            data={this.props.jobs}
            onChange={this.handleChangeJob}
            value={this.state.jid}
          />
        </span>
      </div>
    )
  }

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
        showPhone
        showResume
        showSource
        showPosition
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
        <Menu activeMenu="interview" key="menu" />
        <div key="content">
          {this.renderSearch()}
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
