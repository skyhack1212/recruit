import React from 'react'
import {Checkbox, Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import Chatting from 'components/Common/Chatting'
import JobSelect from 'components/Resume/JobSelect'
import StateSelect from 'components/Resume/StateSelect'
import {COMMON_INIT_MESSAGE, DEFAULT_STATE} from 'constants/resume'

import styles from './index.less'

@connect(state => ({
  loading: state.loading.models.resumes,
}))
export default class Talents extends React.Component {
  state = {
    data: [],
    page: 0,
    jid: '',
    state: DEFAULT_STATE,
    selectedIds: [],
    allJobs: [],
    showChatting: false,
    chattingInitMessage: '',
    currentChattingTalents: [],
    batch: false,
    chattingAction: '',
  }

  componentWillMount() {
    this.refreshData()
    this.fetchJobs()
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  fetchJobs = () =>
    this.props
      .dispatch({
        type: 'global/fetchJos',
      })
      .then(data => {
        this.setState({allJobs: R.propOr([], 'jobs', data)})
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
        data: [...this.state.data, ...data.list],
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

  handleChangeJob = jid =>
    this.setState({jid, selectedIds: [], page: 0, data: []}, this.refreshData)

  handleChangeState = e =>
    this.setState(
      {state: e.target.value, selectedIds: [], page: 0, data: []},
      this.refreshData
    )

  handleSelect = id => selected => {
    const {selectedIds} = this.state
    this.setState({
      selectedIds: selected
        ? [...selectedIds, id]
        : R.without([id], selectedIds),
    })
  }

  handleSelectAll = e =>
    this.setState({
      selectedIds: e.target.checked ? this.getAllIds() : [],
    })

  handleBatchContact = () => {
    const {selectedIds, data} = this.state
    this.setState({
      showChatting: true,
      currentChattingTalents: data.filter(({id}) => selectedIds.includes(id)),
      chattingInitMessage: COMMON_INIT_MESSAGE,
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
      .then(() => {
        message.success('操作成功')
        this.refreshData()
      })

  handleElimination = id => () =>
    this.props
      .dispatch({
        type: 'resumes/elimination',
        payload: {
          to_uid: id,
        },
      })
      .then(() => {
        message.success('操作成功')
        this.refreshData()
      })

  handleSendMessage = content => {
    const {currentChattingTalents} = this.state
    const {length} = currentChattingTalents
    if (length === 1) {
      this.sendSingleMessage(currentChattingTalents[0], content)
    } else if (length > 1) {
      this.sendBatchMessage(currentChattingTalents, content)
    }
  }

  handleApplyMessage = content =>
    this.props
      .dispatch({
        type: 'resumes/applyMessage',
        payload: {
          to_uid: this.state.currentChattingTalents[0].id,
          content,
        },
      })
      .then(this.showMessageSuccess)

  sendSingleMessage = (talent, content) =>
    this.props
      .dispatch({
        type: 'resumes/sendMessage',
        payload: {
          to_uid: talent.id,
          content,
        },
      })
      .then(this.showMessageSuccess)

  sendBatchMessage = (talents, content) =>
    this.props
      .dispatch({
        type: 'resumes/batchSendMessage',
        payload: {
          to_uid: talents.map(R.prop('id')).join(','),
          content,
        },
      })
      .then(this.showMessageSuccess)

  showMessageSuccess = () => {
    this.handleCancelChatting()
    this.refreshData()
    message.success('消息发送成功')
  }

  handleShowChatting = (talent, action) => () =>
    this.setState({
      currentChattingTalents: [talent],
      showChatting: true,
      chattingInitMessage: COMMON_INIT_MESSAGE,
      chattingAction: action,
    })

  handleCancelChatting = () =>
    this.setState({
      currentChattingTalents: [],
      showChatting: false,
    })

  renderSearch = () => {
    return (
      <div className={styles.search}>
        <span className={styles.searchPosition}>
          <JobSelect
            data={this.state.allJobs}
            onChange={this.handleChangeJob}
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
                {source === 1 && (
                  <Button
                    type="primary"
                    onClick={this.handleShowChatting(item, 'contact')}
                  >
                    联系人才
                  </Button>
                )}
                {source === 2 && (
                  <Button
                    type="primary"
                    onClick={this.handleShowChatting(item, 'apply')}
                  >
                    回复申请
                  </Button>
                )}
                <span className={styles.operateButtonPanel}>
                  <Button
                    type="primary"
                    onClick={this.handleComplete(item.id)}
                    className={styles.operateButton}
                    ghost
                  >
                    完成
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.handleElimination(item.id)}
                    className={styles.operateButton}
                    ghost
                  >
                    淘汰
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
        text: '批量联系',
        op: this.handleBatchContact,
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
      currentChattingTalents,
      chattingAction,
    } = this.state
    return [
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        renderSearch={this.renderSearch}
        renderBatchOperation={this.renderBatchOperation}
        dataLength={data.length}
        remain={remain}
        key="list"
        search={state}
      />,
      currentChattingTalents.length > 0 && (
        <Chatting
          show={this.state.showChatting}
          initMessage={this.state.chattingInitMessage}
          talents={this.state.currentChattingTalents}
          onSend={
            chattingAction === 'contact'
              ? this.handleSendMessage
              : this.handleApplyMessage
          }
          onCancel={this.handleCancelChatting}
        />
      ),
    ]
  }
}
