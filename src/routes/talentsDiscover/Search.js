import React from 'react'
import {Input, Icon, Checkbox, message} from 'antd'
import classnames from 'classnames'
import {connect} from 'dva'
import * as R from 'ramda'

import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import {COMMON_INIT_MESSAGE} from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import AdvancedSearch from 'components/TalentsDiscover/Search/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsDiscover/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './search.less'

class Talents extends React.Component {
  static defaultProps = {
    advancedSearch: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      search: '',
      currentSearch: '',
      selectedIds: [],
      showInviteModal: false,
      inviteTelentIds: [],
      remain: 0,
      advancedSearch: {
        city: '北京',
        work_time: -1,
        degree: -1,
        company_level: -1,
        is_211_985: 0,
      },
    }
  }

  componentWillMount() {
    this.fetchJobs()
  }

  // componentWillReceiveProps(newProps) {
  //   if (!R.equals(newProps.advancedSearch, this.props.advancedSearch)) {
  //     this.setState(
  //       {
  //         advancedSearch: newProps.advancedSearch,
  //       },
  //       this.refreshData
  //     )
  //   }
  // }

  setSearch = e => {
    const {value} = e.target
    if (R.trim(value) === '') {
      this.setState({data: [], remain: 0, currentSearch: ''})
    }
    this.setState({search: value})
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  fetchJobs = () => {
    return this.props.dispatch({
      type: 'global/fetchJobs',
    })
  }

  refreshData = () => {
    if (this.state.search === '') {
      return
    }

    this.loadData().then(data => {
      this.setState({
        data: data.contacts,
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

  loadData = () =>
    this.props.dispatch({
      type: 'talents/fetch',
      payload: {
        page: this.state.page,
        keyword: this.state.currentSearch,
        ...this.state.advancedSearch,
      },
    })

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  showInviteSuccess = () => {
    this.handleCancelChatting()
    this.refreshData()
    message.success('消息发送成功')
  }

  handleInviteBatch = () => {
    const {selectedIds} = this.state

    if (selectedIds.length === 0) {
      message.warn('没有选中项')
      return
    }

    this.setState({
      inviteTelentIds: selectedIds,
      showInviteModal: true,
    })
  }

  handleSubmitInvite = (content, jid) => {
    if (this.props.jobs.length === 0) {
      message.warning('当前您没有发布职位，不能发出职位邀请')
    }

    const {length} = this.state.inviteTelentIds
    if (length === 1) {
      this.sendInviteMessageSingle(content, jid)
      return
    }
    this.sendInviteMessageBatch(content, jid)
  }

  showSendMessageSuccess = () => {
    this.handleCancelInvite()
    this.refreshData()
    message.success('发送邀请成功')
  }

  sendInviteMessageSingle = (content, jid) =>
    this.props
      .dispatch({
        type: 'resumes/sendMessage',
        payload: {
          to_uid: this.state.inviteTelentIds[0],
          content,
          jid,
          source: 'search',
        },
      })
      .then(this.showSendMessageSuccess)

  sendInviteMessageBatch = (content, jid) =>
    this.props
      .dispatch({
        type: 'resumes/batchSendMessage',
        payload: {
          to_uids: this.state.inviteTelentIds
            .map(uid => `${uid}|${jid}`)
            .join(','),
          content,
          source: 'search',
        },
      })
      .then(this.showSendMessageSuccess)

  handleSearch = currentSearch => {
    const {currentSearch: lastSearch} = this.state
    if (R.trim(currentSearch) === lastSearch) {
      return
    }
    this.setState(
      {
        currentSearch: R.trim(currentSearch),
        search: R.trim(currentSearch),
        selectedIds: [],
        page: 0,
      },
      this.refreshData
    )
  }

  handleBlurSearch = e => this.handleSearch(e.target.value)

  handleJobSearch = position => () => this.handleSearch(position)

  handleClearSearch = () => {
    this.setState({search: '', page: 0, currentSearch: '', data: []})
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

  handleShowInviteModal = talentId => () =>
    this.setState({
      inviteTelentIds: [talentId],
      showInviteModal: true,
    })

  handleCancelInvite = () =>
    this.setState({
      inviteTelentIds: [],
      showInviteModal: false,
    })

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  renderSearch = () => {
    const clearButton = <span onClick={this.handleClearSearch}>×</span>
    return (
      <div className={styles.search} key="search">
        <Input.Search
          placeholder="请输入搜索关键词"
          enterButton="搜索"
          size="large"
          value={this.state.search}
          onSearch={this.handleSearch}
          addonAfter={clearButton}
          onChange={this.setSearch}
          onBlur={this.handleBlurSearch}
        />
      </div>
    )
  }

  renderJobSearch = () => {
    const {jobs} = this.props
    const renderJob = job => (
      <li key={job.jid} className={styles.jobSearchPanelItem}>
        <span onClick={this.handleJobSearch(job.position)}>{job.position}</span>
      </li>
    )
    return (
      <div className={styles.jobSearchPanel} key="jobSearch">
        <h3 className={styles.jobSearchTitle} key="title">
          按 已发布职位 进行搜索{' '}
          <span className={styles.jobSearchTip}>按职位快速搜索</span>
        </h3>
        <ul className={styles.jobSearchList} key="jobs">
          {jobs.map(renderJob)}
        </ul>
      </div>
    )
  }

  renderTalentItem = item => {
    const {selectedIds} = this.state
    return (
      <TalentCard
        data={item}
        key={item.id}
        checked={selectedIds.includes(item.id)}
        onCheck={this.handleSelect(item.id)}
        showCheckbox
      >
        <div className={styles.operationPanel}>
          <p className={styles.operationLine}>
            <span
              className={classnames(styles.operation, {
                [styles.operationActive]: !item.is_archive,
              })}
              onClick={
                item.is_archive ? null : this.handleShowInviteModal(item.id)
              }
            >
              <Icon type="folder-open" className={styles.operationIcon} />
              {item.is_archive ? '已关联' : '职位邀请'}
            </span>
          </p>
        </div>
      </TalentCard>
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
        <span className={styles.batchPreview} onClick={this.handleInviteBatch}>
          <Icon type="copy" className={styles.batchPreviewIcon} />
          批量邀请
        </span>
      </div>
    )
  }

  render() {
    const {loading = false, jobs} = this.props
    const {
      data,
      remain,
      currentSearch,
      showInviteModal,
      advancedSearch,
    } = this.state
    const {length: dataLength} = data
    const {inviteTelentIds} = this.state
    const inviteTalents = data.filter(talent =>
      inviteTelentIds.includes(talent.id)
    )

    return (
      <Layout>
        <Menu activeMenu="search" key="menu" />,
        <div key="content">
          {this.renderSearch()}
          {dataLength === 0 ? this.renderJobSearch() : null}
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            renderBatchOperation={this.renderBatchOperation}
            dataLength={dataLength}
            remain={remain}
            key="list"
            search={currentSearch}
          />,
          <Chatting
            show={showInviteModal}
            initMessage={COMMON_INIT_MESSAGE}
            talents={inviteTalents}
            onSend={this.handleSubmitInvite}
            onCancel={this.handleCancelInvite}
            key="inviteModal"
            titlePre="邀请"
            showPosition
            allJobs={jobs}
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
