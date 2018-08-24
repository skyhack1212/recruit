import React from 'react'
import {Checkbox, Button, message, Popover, Icon} from 'antd'
import {connect} from 'dva'
import classnames from 'classnames'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import JobSelect from 'components/Common/JobSelect'
import AdvancedSearch from 'components/TalentsFollow/Communication/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsFollow/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './communication.less'

@connect(state => ({
  loading: state.loading.models.resumes,
  jobs: state.global.jobs,
}))
export default class Resume extends React.Component {
  state = {
    data: [],
    remain: 0,
    page: 0,
    jid: '',
    selectedIds: [],
    advancedSearch: {
      category: ['hasResume', 'noResume'],
      source: ['search', 'recommend', 'delivery'],
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
    const transformAdvancedSearch = {
      source: R.join(','),
    }
    const advancedSearch = R.mapObjIndexed(
      (v, key) =>
        transformAdvancedSearch[key] ? transformAdvancedSearch[key](v) : v,
      this.state.advancedSearch
    )
    return this.props.dispatch({
      type: 'resumes/fetch',
      payload: {
        ...jidParam,
        page: this.state.page,
        state: 'follow',
        ...advancedSearch,
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
    window.open(`https://maimai.cn/im?target=${uid}`, '脉脉聊天')
    e.stopPropagation()
  }

  handleShowMorePop = e => e.stopPropagation()

  handleModifyState = (talentId, state) => e => {
    this.props
      .dispatch({
        type: 'talents/modifyState',
        payload: {
          to_uids: talentId,
          state,
        },
      })
      .then(this.refreshData)

    e.stopPropagation()
  }

  handleBatchModifyState = state => e => {
    this.props
      .dispatch({
        type: 'talents/modifyState',
        payload: {
          to_uids: this.state.selectedIds.join(','),
          state,
        },
      })
      .then(this.refreshData)

    e.stopPropagation()
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

    const morePop = (
      <ul className={styles.morePop}>
        <li>
          <span onClick={this.handleModifyState(item.id, 'interview')}>
            <Icon type="smile-o" className={styles.myIcon} /> 待约面
          </span>
        </li>
        <li>
          <span onClick={this.handleModifyState(item.id, 'elimination')}>
            <Icon type="close" className={styles.myIcon} /> 不合适
          </span>
        </li>
      </ul>
    )
    const buttons = (
      <span>
        <Button
          onClick={this.handleChatting(item.uid || item.id)}
          className={classnames({
            [styles.hasNewMessage]: item.has_new_message,
            [styles.operation]: true,
          })}
        >
          脉脉沟通
        </Button>
        <Popover
          content={morePop}
          trigger="click"
          className={styles.moreButton}
          placement="bottom"
          onClick={this.handleShowMorePop}
        >
          <Icon type="ellipsis" />
        </Popover>
      </span>
    )

    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        buttons={buttons}
        showPhone
        showResume
        showCheckbox
        showPosition
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
        text: '批量不合适',
        op: this.handleBatchModifyState('elimination'),
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
                ghost
              >
                {item.text}
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
        <Menu activeMenu="communication" key="menu" />
        <div key="content">
          {this.renderSearch()}
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            renderBatchOperation={this.renderBatchOperation}
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
