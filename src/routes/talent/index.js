import React from 'react'
import {Input, Icon, Checkbox, Modal, Button, message} from 'antd'
import {connect} from 'dva'
import * as R from 'ramda'

import TalentCard from 'components/Common/TalentCard'
import defaultImgUrl from 'images/default.png'

import styles from './index.less'

class Talents extends React.Component {
  state = {
    data: [],
    page: 1,
    search: '',
    selectedIds: [],
    selectedJob: '',
    showArchiveModal: false,
    currentArchiveTalent: '',
    allJobs: [{id: 1, name: '前端工程师'}, {id: 2, name: 'python 工程师'}],
    remain: 0,
    haveSearched: false,
  }

  componentWillMount() {
    this.fetchJobs()
  }

  componentDidMount() {
    const callback = () => {
      const {bottom} = this.container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (bottom && bottom < windowHeight) {
        // 当 wrapper 已经被滚动到页面可视范围之内触发
        if (!this.props.loading) {
          this.loadMore()
        }
      }
    }

    document.getElementById('content').addEventListener(
      'scroll',
      () => {
        callback()
      },
      false
    )
  }

  setSearch = e => {
    const {value} = e.target
    if (!value) {
      this.setState({data: [], remain: 0, haveSearched: false})
    }
    this.setState({search: value})
  }

  getAllIds = () => this.state.data.map(R.prop('id'))

  fetchJobs = () => {
    return this.props
      .dispatch({
        type: 'global/fetchJos',
      })
      .then(data => {
        this.setState({allJobs: R.propOr([], 'jobs', data)})
      })
  }

  refreshData = () => {
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
        data: [...this.state.data, ...data.contacts],
        remain: data.remain,
      })
    })
  }

  loadData = () => {
    const param = {
      page: this.state.page,
      keyword: this.state.search,
    }
    return this.props.dispatch({
      type: 'talents/fetch',
      payload: param,
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

  previewBatch = () => {
    // console.log('preview')
  }

  handlePageChange = () => {
    this.setState({page: this.state.page + 1}, this.appendData)
  }

  handleSaearch = () => {
    this.setState({selectedIds: [], haveSearched: true}, this.refreshData)
  }

  handleClearSearch = () => {
    this.setState({search: '', haveSearched: false}, this.refreshData)
  }

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

  handleSelectAll = e => {
    this.setState({
      selectedIds: e.target.checked ? this.getAllIds() : [],
    })
  }

  handleSelectJob = jobId => e => {
    this.setState({
      selectedJob: e.target.checked ? jobId : '',
    })
  }

  handleShowArchiveModal = talentId => () =>
    this.setState({
      currentArchiveTalent: talentId,
      showArchiveModal: true,
    })

  handleCancelArchive = () =>
    this.setState({
      currentArchiveTalent: '',
      showArchiveModal: false,
      selectedJob: '',
    })

  handleArchive = e => {
    if (this.state.allJobs.length === 0) {
      message.warning('当前您没有发布职位，不能归档!')
    }
    e.preventDefault()
    this.props
      .dispatch({
        type: 'talents/archive',
        payload: {
          to_uid: this.state.currentArchiveTalent,
          jid: this.state.selectedJob,
        },
      })
      .then(() => {
        this.refreshData()
        this.handleCancelArchive()
      })
  }

  renderSearch = () => {
    const clearButton = <span onClick={this.handleClearSearch}>×</span>
    return (
      <div className={styles.search}>
        <Input.Search
          placeholder="请输入搜索关键词"
          enterButton="搜索"
          size="large"
          value={this.state.search}
          onSearch={this.handleSaearch}
          addonAfter={clearButton}
          onChange={this.setSearch}
        />
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
      >
        <div className={styles.operationPanel}>
          <p className={styles.operationLine}>
            <span
              className={styles.operation}
              onClick={this.handleShowArchiveModal(item.id)}
            >
              <Icon type="folder-open" className={styles.operationIcon} />收藏人才
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

  renderEmpty = () => {
    return <div className={styles.centerTip}>没有搜索结果</div>
  }

  renderLoading = () => {
    return (
      <div className={styles.centerTip}>
        <Icon type="loading" /> 正在努力加载数据！
      </div>
    )
  }

  renderDefaultTip = () => {
    return (
      <div className={`${styles.centerTip} ${styles.defaultTip}`}>
        <img src={defaultImgUrl} alt="defaultImg" />请输入查询关键词!
      </div>
    )
  }

  renderMore = () => {
    return (
      <div
        className={`${styles.centerTip} ${styles.more}`}
        onClick={this.loadMore}
      >
        {this.state.ramain ? '加载更多...' : '没有更多数据'}
      </div>
    )
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
        <span className={styles.previewBatch}>
          <Icon
            type="copy"
            className={styles.previewBatchIcon}
            onClick={this.previewBatch}
          />
          批量查看
        </span>
      </div>
    )
  }

  renderArchiveModal = () => {
    const {loading} = this.props
    const renderItem = item => {
      const {jid, position} = item
      return (
        <label className={styles.archiveJobItem} key={jid} htmlFor={jid}>
          <span className={styles.archiveJobItemName}>{position}</span>
          <Checkbox
            onClick={this.handleSelectJob(jid)}
            id={jid}
            checked={this.state.selectedJob === jid}
          />
        </label>
      )
    }

    const footer = [
      <Button
        type="primary"
        key="archiveButton"
        loading={loading}
        onClick={this.handleArchive}
        className={styles.archiveButton}
        disabled={!this.state.selectedJob}
      >
        归档
      </Button>,
    ]

    return (
      <Modal
        visible={this.state.showArchiveModal}
        title="归档"
        onCancel={this.handleCancelArchive}
        footer={footer}
      >
        {this.state.allJobs.map(renderItem)}
      </Modal>
    )
  }

  render() {
    const {loading} = this.props
    const {data, remain, search, haveSearched} = this.state
    return (
      <div
        className={styles.content}
        ref={dom => {
          this.container = dom
        }}
      >
        {this.renderSearch()}
        {data.length > 0 && this.renderBatchOperation()}
        {data.length > 0 && this.renderList()}
        {this.renderArchiveModal()}
        {remain && !loading ? this.renderMore() : null}
        {loading && this.renderLoading()}
        {!loading && search && data.length === 0 && haveSearched
          ? this.renderEmpty()
          : null}
        {!haveSearched && this.renderDefaultTip()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.loading.models.talents,
})

export default connect(mapStateToProps)(Talents)
