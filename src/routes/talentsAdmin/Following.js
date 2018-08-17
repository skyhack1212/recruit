import React from 'react'
import {Checkbox, Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import JobSelect from 'components/Common/JobSelect'

import styles from './following.less'

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
    advancedSearch: this.props.advancedSearch,
  }

  componentWillMount() {
    this.refreshData()
    this.fetchJobs()
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.advancedSearch, this.props.advancedSearch)) {
      this.setState(
        {
          advancedSearch: newProps.advancedSearch,
        },
        this.refreshData
      )
    }
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
        source: this.state.advancedSearch.source.join(','),
        page: this.state.page,
        state: 'follow',
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

  handleChatting = uid => () => {
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
    const {selectedIds, state} = this.state
    const {id} = item
    const showOperate = !['complete', 'elimination'].includes(state)

    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showPhone
        showResume
        showCheckbox
      >
        {showOperate && (
          <div className={styles.operationPanel}>
            <p className={styles.operationLine}>
              <span className={styles.operation}>
                <Button
                  type="primary"
                  onClick={this.handleChatting(item.uid || item.id)}
                  className={item.has_new_message ? styles.hasNewMessage : ''}
                >
                  脉脉沟通
                </Button>
                <span className={styles.operateButtonPanel}>
                  <Button
                    type="primary"
                    onClick={this.handleModifyState(item.id, 'interview')}
                    className={styles.operateButton}
                    ghost
                  >
                    待约面
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleModifyState(item.id, 'elimination')}
                    className={styles.operateButton}
                    ghost
                  >
                    不合适
                  </Button>
                </span>
              </span>
            </p>
          </div>
        )}
      </TalentCard>
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
    const {data, remain} = this.state
    return [
      this.renderSearch(),
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        renderBatchOperation={this.renderBatchOperation}
        dataLength={data.length}
        remain={remain}
        key="list"
        search="flowing"
      />,
    ]
  }
}
