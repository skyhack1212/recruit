import React from 'react'
import {connect} from 'dva'
import * as R from 'ramda'
import {message} from 'antd'

import JobSelect from 'components/Common/JobSelect'
import List from 'components/Common/List'
import TalentCard from 'components/TalentsDiscover/Recommend/TalentCard'
import {COMMON_INIT_MESSAGE} from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import AdvancedSearch from 'components/TalentsDiscover/Recommend/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/TalentsDiscover/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

class Recommends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      job: '',
      remain: 0,
      advancedSearch: {
        // work_time: -1,
        // degree: -1,
      },
      showInviteModal: false,
      inviteTelentIds: [],
    }
  }

  componentWillMount() {
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

  refreshData = () =>
    this.state.job &&
    this.loadData().then(data => {
      this.setState({
        data: data.contacts,
        remain: data.remain,
      })
    })

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
      type: 'recommends/fetch',
      payload: {
        page: this.state.page,
        jid: this.state.job,
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

  handleSearch = job => {
    this.setState({job}, this.refreshData)
  }

  handleSetUnfit = () => {}

  handleSetFit = toUid =>
    this.props
      .dispatch({
        type: 'talents/archive',
        payload: {
          to_uid: toUid,
          jid: this.state.job,
          source: 'recommend',
        },
      })
      .then(this.refreshData)

  handleSubmitInvite = (content, jid) => {
    this.props
      .dispatch({
        type: 'resumes/sendMessage',
        payload: {
          to_uid: this.state.inviteTelentIds[0],
          content,
          jid,
          source: 'recommend',
        },
      })
      .then(this.showSendMessageSuccess)
  }

  handleShowInviteModal = talentId => {
    this.setState({
      showInviteModal: true,
      inviteTelentIds: [talentId],
    })
  }

  handleCancelInvite = () => {
    this.setState({
      showInviteModal: false,
    })
  }

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  showSendMessageSuccess = () => {
    this.handleCancelInvite()
    this.refreshData()
    message.success('发送邀请成功')
  }

  renderSearch = () => (
    <div style={{padding: '10px 30px'}} key="search">
      <JobSelect
        data={this.props.jobs}
        onChange={this.handleSearch}
        value={this.state.job}
      />
    </div>
  )

  renderList = () => (
    <div>
      {this.state.data.map(item => (
        <TalentCard
          data={item}
          key={item.id}
          onInvite={this.handleShowInviteModal}
          onSetUnfit={this.handleSetUnfit}
        />
      ))}
    </div>
  )

  render() {
    const {loading = false, jobs} = this.props
    const {
      data,
      remain,
      showInviteModal,
      inviteTelentIds,
      advancedSearch,
    } = this.state
    const inviteTalents = data.filter(talent =>
      inviteTelentIds.includes(talent.id)
    )

    return (
      <Layout>
        <Menu activeMenu="recommend" key="menu" />
        <div key="content">
          {this.renderSearch()}
          <List
            renderList={this.renderList}
            loadMore={this.loadMore}
            loading={loading}
            dataLength={data.length}
            remain={remain}
            key="list"
            search={this.state.job}
          />
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
  loading: state.loading.models.recommends,
  jobs: state.global.jobs,
})

export default connect(mapStateToProps)(Recommends)
