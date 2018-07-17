import React from 'react'
import {Icon, Checkbox, Select, Radio, Button} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'
import TalentCard from 'components/Common/TalentCard'
import Chatting from 'components/Common/Chatting'
import {
  RESUME_STATE_MAP,
  COMMON_INIT_MESSAGE,
  DEFAULT_STATE,
} from 'constants/resume'

import styles from './index.less'

@connect(state => ({
  loading: state.loading.models.talents,
}))
export default class Talents extends React.Component {
  state = {
    data: [],
    page: 1,
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

  componentDidMount() {
    const callback = () => {
      const {bottom} = this.container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      if (bottom && bottom < windowHeight && !this.props.loading) {
        this.loadMore()
      }
    }

    document
      .getElementById('content')
      .addEventListener('scroll', callback, false)
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

  loadData = () =>
    this.props.dispatch({
      type: 'resumes/fetch',
      payload: R.pickAll(['page', 'jid', 'state'], this.state),
    })

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )

  handleChangeJob = jid =>
    this.setState({jid, selectedIds: []}, this.refreshData)

  handleChangeState = e =>
    this.setState({state: e.target.value, selectedIds: []}, this.loadData)

  handleSelect = id => selected => {
    const {selectedIds} = this.state
    if (selected) {
      this.setState({
        selectedIds: [...selectedIds, id],
      })
    } else {
      this.setState({
        selectedIds: R.without([id], selectedIds),
      })
    }
  }

  handleSelectAll = e =>
    this.setState({
      selectedIds: e.target.checked ? this.getAllIds() : [],
    })

  handleBatchLink = () => {
    const {selectedIds, data} = this.state
    this.setState({
      showChatting: true,
      currentChattingTalents: data.filter(({id}) => selectedIds.includes(id)),
      chattingInitMessage: COMMON_INIT_MESSAGE,
    })
  }

  handleComplete = id => () =>
    this.props.dispatch({
      type: 'resumes/complete',
      payload: {
        to_uid: id,
      },
    })

  handleElimination = id => () =>
    this.props.dispatch({
      type: 'resumes/elimination',
      payload: {
        to_uid: id,
      },
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
      .then(this.handleCancelChatting)

  sendSingleMessage = (talent, content) =>
    this.props
      .dispatch({
        type: 'resumes/sendMessage',
        payload: {
          to_uid: talent.id,
          content,
        },
      })
      .then(this.handleCancelChatting)

  sendBatchMessage = (talents, content) =>
    this.props
      .dispatch({
        type: 'resumes/batchSendMessage',
        payload: {
          to_uid: talents.map(R.prop('id')).join(','),
          content,
        },
      })
      .then(this.handleCancelChatting)

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
    const jobOptions = this.state.allJobs.map(item => (
      <Select.Option key={item.jid} value={item.jid}>
        {item.position}
      </Select.Option>
    ))

    const searchJob = (
      <Select
        showSearch
        allowClear
        style={{width: 200}}
        placeholder="请选择职位"
        optionFilterProp="children"
        value={this.state.jid}
        onChange={this.handleChangeJob}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {jobOptions}
      </Select>
    )

    const searchState = (
      <Radio.Group value={this.state.state} onChange={this.handleChangeState}>
        {R.values(
          R.mapObjIndexed(
            (text, key) => (
              <Radio.Button value={key} key={key}>
                {text}
              </Radio.Button>
            ),
            RESUME_STATE_MAP
          )
        )}
      </Radio.Group>
    )

    return (
      <div className={styles.search}>
        <span className={styles.searchPosition}>{searchJob}</span>
        <span className={styles.searchState}>{searchState}</span>
      </div>
    )
  }

  renderTalentItem = item => {
    const {selectedIds, state} = this.state
    const {id, source} = item
    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showPhone
        showResume
      >
        {state !== 'complete' &&
          state !== 'elimination' && (
            <div className={styles.operationPanel}>
              <p className={styles.operationLine}>
                <span className={styles.operation}>
                  {source === 0 && (
                    <Button
                      type="primary"
                      onClick={this.handleShowChatting(item, 'contact')}
                    >
                      联系人才
                    </Button>
                  )}
                  {source === 1 && (
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

  renderEmpty = () => <h3 className={styles.emptyTip}>没有搜索结果</h3>

  renderLoading = () => (
    <div>
      <Icon type="loading" />正在加载数据...
    </div>
  )

  renderMore = () => (
    <div>{this.state.remain ? '加载更多' : '没有更多数据'}</div>
  )

  renderBatchOperation = () => {
    const {selectedIds, state} = this.state
    const allIds = this.getAllIds()
    const allSelected =
      selectedIds.length > 0 && selectedIds.length === allIds.length

    const batchButtons = [
      {
        text: '批量联系',
        op: this.handleBatchLink,
      },
      // finish: '批量完成',
      // fail: '批量淘汰',
    ]
    return (
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
  }

  render() {
    const {loading} = this.props
    const {data, currentChattingTalents, chattingAction} = this.state
    return (
      <div
        className={styles.content}
        ref={dom => {
          this.container = dom
        }}
      >
        {this.renderSearch()}
        {this.renderBatchOperation()}
        {data.length === 0 ? this.renderEmpty() : this.renderList()}
        {loading && this.renderLoading()}
        {!loading && this.renderMore()}
        {currentChattingTalents.length > 0 && (
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
        )}
      </div>
    )
  }
}
