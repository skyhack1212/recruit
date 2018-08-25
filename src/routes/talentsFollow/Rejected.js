import React from 'react'
import {Button, message, Checkbox, Icon} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import JobSelect from 'components/Common/JobSelect'
import AdvancedSearch from 'components/TalentsFollow/Rejected/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsFollow/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './rejected.less'

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
        state: 'reject',
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

  handleModifyState = (talentId, state) => () => {
    this.props.dispatch({
      type: 'talents/modifyState',
      payload: {
        to_uids: talentId,
        state,
      },
    })
  }

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  handleAddTalentPool = uid => e => {
    e.stopPropagation()

    this.props
      .dispatch({
        type: 'talentPool/add',
        payload: {
          to_uid: uid,
          join_source: 'recruit',
          join_reason: 'reject',
        },
      })
      .then(this.refreshData)
  }

  handleBatchAddTalentPool = () => {
    this.props
      .dispatch({
        type: 'talentPool/add',
        payload: {
          to_uid: this.state.selectedIds.join(','),
          join_source: 'recruit',
          join_reason: 'reject',
        },
      })
      .then(this.refreshData)
  }

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
    const {id, in_pool: inPool} = item
    const buttons = [
      <Button
        key="communication"
        onClick={this.handleAddTalentPool(item.uid || item.id)}
        className={styles.operation}
        disabled={!!inPool}
      >
        {inPool ? '已在人才库' : '加入人才库'}
      </Button>,
    ]
    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        buttons={buttons}
        showPhone
        showResume
        showSource
        showPosition
        showCheckbox
      />
    )
  }

  renderList = () => <div>{this.state.data.map(this.renderTalentItem)}</div>

  renderBatchOperation = () => {
    const {selectedIds, data} = this.state
    const allIds = this.getAllIds()
    const allSelected =
      selectedIds.length > 0 && selectedIds.length === allIds.length

    const batchButtons = [
      {
        text: '批量加入人才库',
        op: this.handleBatchAddTalentPool,
      },
      // finish: '批量完成',
      // fail: '批量淘汰',
    ]
    return (
      data.length > 0 && (
        <div className={styles.batchOperation}>
          <span className={styles.checkAll}>
            <Checkbox checked={allSelected} onChange={this.handleSelectAll}>
              全选 [已选中 {selectedIds.length} 项]
            </Checkbox>
          </span>
          <span className={styles.previewBatch}>
            {batchButtons.map(item => (
              <Button
                type="primary"
                key={item.key || item.text}
                onClick={item.op}
                className={styles.batchOperateButton}
                disabled={selectedIds.length === 0}
              >
                <Icon type="database" /> {item.text}
              </Button>
            ))}
          </span>
        </div>
      )
    )
  }

  render() {
    const {loading = false} = this.props
    const {data, remain, advancedSearch} = this.state
    return (
      <Layout>
        <Menu activeMenu="rejected" key="menu" />
        <div key="content">
          {this.renderSearch()}
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            dataLength={data.length}
            renderBatchOperation={this.renderBatchOperation}
            remain={remain}
            key="list"
            search="rejected"
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
