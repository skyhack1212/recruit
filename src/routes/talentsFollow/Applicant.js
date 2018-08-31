import React from 'react'
import {Icon, Checkbox, message, Button, Popover} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'

import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import {REPLY_INIT_MESSAGE} from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import JobSelect from 'components/Common/JobSelect'
import AdvancedSearch from 'components/TalentsFollow/Applicant/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsFollow/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './applicant.less'

class Talents extends React.Component {
  static defaultProps = {
    advancedSearch: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      selectedIds: [],
      remain: 0,
      advancedSearch: {
        filter: [],
      },
      job: '',
      showReplyModal: false,
      replyIds: [],
    }
  }

  componentDidMount() {
    this.fetchJobs()
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.advancedSearch, this.props.advancedSearch)) {
      this.setState(
        {
          // advancedSearch: newProps.advancedSearch,
        },
        this.refreshData
      )
    }
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  fetchJobs = () => {
    return this.props
      .dispatch({
        type: 'global/fetchJobs',
      })
      .then(({jobs}) => {
        const job = R.pathOr('', [0, 'jid'], jobs)
        this.setState(
          {
            job,
          },
          this.refreshData
        )
      })
  }

  refreshData = () => {
    this.loadData().then(data => {
      this.setState({
        data: data.list,
        remain: data.remain,
      })
    })
  }

  appendData = () => {
    this.loadData().then(data => {
      this.setState({
        data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.contacts]),
        remain: data.remain,
      })
    })
  }

  loadData = () => {
    const jidParam = this.state.job ? {jid: this.state.job} : {}
    return this.props.dispatch({
      type: 'resumes/fetch',
      payload: {
        page: this.state.page,
        ...jidParam,
        state: 'todo',
        source: 'delivery',
      },
    })
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  sendReplyMessageSingle = content =>
    this.props
      .dispatch({
        type: 'resumes/replyMessage',
        payload: {
          to_uid: this.state.replyIds[0],
          content,
        },
      })
      .then(this.showSendMessageSuccess)

  sendReplyMessageBatch = content =>
    this.props
      .dispatch({
        type: 'resumes/batchReplyMessage',
        payload: {
          to_uids: this.state.replyIds.join(','),
          content,
        },
      })
      .then(this.showSendMessageSuccess)

  showSendMessageSuccess = () => {
    this.handleCancelReply()
    this.refreshData()
    message.success('回复消息成功')
  }

  handleJobChange = job => {
    this.setState({job}, this.refreshData)
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

  handleCancelReply = () => {
    this.setState({
      showReplyModal: false,
    })
  }

  handleReplyBatch = () => {
    if (this.state.selectedIds.length === 0) {
      message.warn('没有选中项')
      return
    }

    this.setState({
      showReplyModal: true,
      replyIds: this.state.selectedIds,
    })
  }

  handleReply = talentId => e => {
    this.setState({
      showReplyModal: true,
      replyIds: [talentId],
    })
    e.stopPropagation()
  }

  handleSendReplyMessage = content => {
    if (this.state.replyIds.length === 1) {
      this.sendReplyMessageSingle(content)
      return
    }
    this.sendReplyMessageBatch(content)
  }

  handleModifyState = (talentId, state) => e => {
    e.stopPropagation()

    this.props
      .dispatch({
        type: 'talents/modifyState',
        payload: {
          to_uids: talentId,
          state,
        },
      })
      .then(this.refreshData)
  }

  handleBatchModifyState = state => () => {
    this.props
      .dispatch({
        type: 'talents/modifyState',
        payload: {
          to_uids: this.state.selectedIds.join(','),
          state,
        },
      })
      .then(this.refreshData)
  }

  handleShowMorePop = e => e.stopPropagation()

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  handleStopPropagation = e => e.stopPropagation()

  renderSearch = () => (
    <div style={{padding: '10px 30px'}} key="search">
      <JobSelect
        data={this.props.jobs}
        onChange={this.handleJobChange}
        value={this.state.job}
      />
    </div>
  )

  renderTalentItem = item => {
    const {selectedIds} = this.state
    const morePop = (
      <ul className={styles.morePop}>
        <li>
          <span
            onClick={this.handleReply(item.id)}
            className={styles.morePopSpan}
          >
            <Icon type="rollback" className={styles.myIcon} /> 回复申请
          </span>
        </li>
        <li>
          <span
            onClick={this.handleModifyState(item.id, 'elimination')}
            className={styles.morePopSpan}
          >
            <Icon type="close" className={styles.myIcon} /> 不合适
          </span>
        </li>
      </ul>
    )
    const buttons = (
      <span>
        <Button
          onClick={this.handleModifyState(item.id, 'interview')}
          key="interview"
          className={styles.operation}
        >
          待约面
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
        key={item.id}
        checked={selectedIds.includes(item.id)}
        onCheck={this.handleSelect(item.id)}
        buttons={buttons}
        showCheckbox
        showPosition
      />
    )
  }

  renderList = () => {
    const {data} = this.state
    return <div>{data.map(this.renderTalentItem)}</div>
  }

  renderBatchOperation = () => {
    const {selectedIds} = this.state
    const allIds = this.getAllIds()
    const allSelected =
      selectedIds.length > 0 && selectedIds.length === allIds.length
    return (
      <div className={styles.batchOperation}>
        <span className={styles.checkAll}>
          <Checkbox checked={allSelected} onChange={this.handleSelectAll}>
            全选 [已选中 {selectedIds.length} 项]
          </Checkbox>
        </span>
        {/* <span className={styles.batchPreview} onClick={this.handleReplyBatch}>
          <Icon type="copy" className={styles.batchPreviewIcon} />
          批量回复
        </span> */}
        <Button
          onClick={this.handleBatchModifyState('elimination')}
          className={styles.batchOpButton}
          type="primary"
          disabled={this.state.selectedIds.length === 0}
        >
          <Icon type="close" className={styles.myIcon} />批量不合适
        </Button>
      </div>
    )
  }

  render() {
    const {loading = false} = this.props
    const {data, remain, job, showReplyModal, advancedSearch} = this.state
    const {length: dataLength} = data
    const {replyIds} = this.state
    const applyTalents = data.filter(talent => replyIds.includes(talent.id))
    return (
      <Layout>
        <Menu activeMenu="applicant" key="menu" />
        <div key="content">
          {this.renderSearch()}
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            renderBatchOperation={this.renderBatchOperation}
            dataLength={dataLength}
            remain={remain}
            key="list"
            search={`${job}`}
          />
          <Chatting
            show={showReplyModal}
            initMessage={REPLY_INIT_MESSAGE}
            talents={applyTalents}
            onSend={this.handleSendReplyMessage}
            onCancel={this.handleCancelReply}
            key="replyModal"
            titlePre="回复"
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

const mapStateToProps = state => ({
  loading: state.loading.models.talents,
  jobs: state.global.jobs,
})

export default connect(mapStateToProps)(Talents)
