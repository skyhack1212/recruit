import React from 'react'
import {Checkbox, Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import Chatting from 'components/Common/Chatting'
import JobSelect from 'components/Resume/JobSelect'
import StateSelect from 'components/Resume/StateSelect'
import {
  COMMON_INIT_MESSAGE,
  DEFAULT_STATE,
  REPLY_INIT_MESSAGE,
} from 'constants/resume'

import styles from './index.less'

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
    state: DEFAULT_STATE,
    selectedIds: [],
    showChatting: false,
    chattingInitMessage: '',
    currentTalent: '',
    chattingAction: 'empty',
    chattingTalents: [],
  }

  componentWillMount() {
    this.refreshData()
    this.fetchJobs()
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  getChattingTalents = ids => {
    const selectedIds = ids || this.state.selectedIds
    return this.state.data.filter(
      item => selectedIds.includes(item.id) && item.source === 1
    )
  }

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
        ...R.pickAll(['page', 'state'], this.state),
        ...jidParam,
      },
    })
  }

  showOperateSuccess = () => {
    message.success('操作成功')
    this.refreshData()
  }

  showSendMessageSuccess = () => {
    this.handleCancelChatting()
    this.refreshData()
    message.success('消息发送成功')
  }

  replyMessage = content =>
    this.props
      .dispatch({
        type: 'resumes/applyMessage',
        payload: {
          to_uid: this.state.chattingTalents[0].id,
          content,
        },
      })
      .then(this.showSendMessageSuccess)

  sendMessage = content =>
    this.props
      .dispatch({
        type: 'resumes/sendMessage',
        payload: {
          to_uid: this.state.chattingTalents[0].id,
          content,
        },
      })
      .then(this.showSendMessageSuccess)

  sendMessageBatch = content =>
    this.props
      .dispatch({
        type: 'resumes/batchSendMessage',
        payload: {
          to_uids: this.state.chattingTalents.map(R.prop('id')).join(','),
          content,
        },
      })
      .then(this.showSendMessageSuccess)

  handleChangeJob = jid =>
    this.setState({jid, selectedIds: [], page: 0, data: []}, this.refreshData)

  handleChangeState = e =>
    this.setState(
      {state: e.target.value, selectedIds: [], page: 0, data: []},
      this.refreshData
    )

  handleSelect = id => selected => {
    const {selectedIds} = this.state
    const result = selected
      ? [...selectedIds, id]
      : R.without([id], selectedIds)

    this.setState({
      selectedIds: result,
    })
  }

  handleSelectAll = e => {
    const selectedIds = e.target.checked ? this.getAllIds() : []
    this.setState({
      selectedIds,
    })
  }

  handleComplete = id => () =>
    this.props
      .dispatch({
        type: 'resumes/complete',
        payload: {
          to_uid: id,
        },
      })
      .then(this.showOperateSuccess)

  handleElimination = id => () =>
    this.props
      .dispatch({
        type: 'resumes/elimination',
        payload: {
          to_uid: id,
        },
      })
      .then(this.showOperateSuccess)

  handleContact = item => () => {
    this.setState({
      showChatting: true,
      chattingInitMessage: COMMON_INIT_MESSAGE,
      chattingAction: 'sendMessage',
      chattingTalents: [item],
    })
  }

  handleContactBatch = () => {
    const talents = this.getChattingTalents()
    if (talents.length === 0) {
      message.warn('选中项中没有可联系的人')
      return
    }

    this.setState({
      showChatting: true,
      chattingInitMessage: COMMON_INIT_MESSAGE,
      chattingAction: 'sendMessageBatch',
      chattingTalents: talents,
    })
  }

  handleReply = item => () => {
    this.setState({
      showChatting: true,
      chattingInitMessage: REPLY_INIT_MESSAGE,
      chattingAction: 'replyMessage',
      chattingTalents: [item],
    })
  }

  handleChatting = uid => () => {
    window.open(`https://maimai.cn/im?target=${uid}`, '脉脉聊天')
  }

  handleCancelChatting = () =>
    this.setState({
      chattingTalents: [],
      showChatting: false,
    })

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
        <span className={styles.searchState}>
          <StateSelect
            value={this.state.state}
            onChange={this.handleChangeState}
          />
        </span>
      </div>
    )
  }

  renderTalentItem = item => {
    const {selectedIds, state} = this.state
    const {id, source} = item
    const showOperate = !['complete', 'elimination'].includes(state)

    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showPhone
        showResume
      >
        {showOperate && (
          <div className={styles.operationPanel}>
            <p className={styles.operationLine}>
              <span className={styles.operation}>
                {source === 1 &&
                  state === 'todo' && (
                    <Button type="primary" onClick={this.handleContact(item)}>
                      发出邀请
                    </Button>
                  )}
                {source === 2 &&
                  state === 'todo' && (
                    <Button type="primary" onClick={this.handleReply(item)}>
                      回复申请
                    </Button>
                  )}

                {state === 'follow' && (
                  <Button
                    type="primary"
                    onClick={this.handleChatting(item.uid || item.id)}
                  >
                    开始沟通
                  </Button>
                )}
                <span className={styles.operateButtonPanel}>
                  <Button
                    type="primary"
                    onClick={this.handleComplete(item.id)}
                    className={styles.operateButton}
                    ghost
                  >
                    合适
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleElimination(item.id)}
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
    const {selectedIds, state, data} = this.state
    const allIds = this.getAllIds()
    const allSelected =
      selectedIds.length > 0 && selectedIds.length === allIds.length

    const batchButtons = [
      {
        text: '批量邀请',
        op: this.handleContactBatch,
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
          {state === 'todo' && (
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
          )}
        </div>
      )
    )
  }

  render() {
    const {loading = false} = this.props
    const {
      data,
      remain,
      state,
      showChatting,
      chattingInitMessage,
      chattingAction,
      chattingTalents,
    } = this.state
    return [
      this.renderSearch(),
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        // renderSearch={this.renderSearch}
        renderBatchOperation={this.renderBatchOperation}
        dataLength={data.length}
        remain={remain}
        key="list"
        search={state}
      />,
      <Chatting
        show={showChatting}
        initMessage={chattingInitMessage}
        talents={chattingTalents}
        onSend={this[chattingAction]}
        onCancel={this.handleCancelChatting}
        key="chattingModal"
        titlePre={chattingAction === 'replyMessage' ? '回复' : '邀请'}
      />,
    ]
  }
}
