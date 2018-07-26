import React from 'react'
import {Input, Icon, Checkbox, message, Popover} from 'antd'
import classnames from 'classnames'
import {connect} from 'dva'
import * as R from 'ramda'

import TalentCard from 'components/Common/TalentCard'
import List from 'components/Common/List'
import ArchiveModal from 'components/Talent/ArchiveModal'

import styles from './index.less'

class Talents extends React.Component {
  state = {
    data: [],
    page: 0,
    search: '',
    currentSearch: '',
    selectedIds: [],
    showArchiveModal: false,
    currentArchiveTalent: '',
    remain: 0,
  }

  componentWillMount() {
    this.fetchJobs()
  }

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
      type: 'global/fetchJos',
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

  previewBatch = () => {
    const {selectedIds, data} = this.state

    if (selectedIds.length === 0) {
      message.warn('没有选中项')
    }

    const selectedItems = data.filter(item => selectedIds.includes(item.id))
    const openDetail = item => {
      window.open(item.detail_url, '_blank')
    }
    R.forEach(openDetail, selectedItems)
  }

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
    this.setState({search: '', page: 0, currentSearch: ''}, this.refreshData)
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

  handleShowArchiveModal = talentId => () =>
    this.setState({
      currentArchiveTalent: talentId,
      showArchiveModal: true,
    })

  handleCancelArchive = () =>
    this.setState({
      currentArchiveTalent: '',
      showArchiveModal: false,
    })

  handleArchive = jid => {
    if (this.props.jobs.length === 0) {
      message.warning('当前您没有发布职位，不能归档!')
    }

    this.props
      .dispatch({
        type: 'talents/archive',
        payload: {
          to_uid: this.state.currentArchiveTalent,
          jid,
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
      <li key={job.jid}>
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
      >
        <div className={styles.operationPanel}>
          <p className={styles.operationLine}>
            <span
              className={classnames(styles.operation, {
                [styles.operationActive]: !item.is_archive,
              })}
              onClick={
                item.is_archive ? null : this.handleShowArchiveModal(item.id)
              }
            >
              <Icon type="folder-open" className={styles.operationIcon} />
              {item.is_archive ? '已加职位' : '加入职位'}
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
        <Popover
          content="使用本功能，需要将「脉脉」加入白名单，如有问题，请联系客服！"
          trigger="hover"
        >
          <span className={styles.batchPreview} onClick={this.previewBatch}>
            <Icon type="copy" className={styles.batchPreviewIcon} />
            批量查看
          </span>
        </Popover>
      </div>
    )
  }

  render() {
    const {loading = false, jobs} = this.props
    const {data, remain, currentSearch, showArchiveModal} = this.state
    const {length: dataLength} = data

    return [
      this.renderSearch(),
      dataLength === 0 ? this.renderJobSearch() : null,
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        // renderSearch={this.renderSearch}
        renderBatchOperation={this.renderBatchOperation}
        dataLength={dataLength}
        remain={remain}
        key="list"
        search={currentSearch}
      />,
      <ArchiveModal
        loading={loading}
        jobs={jobs}
        onCancel={this.handleCancelArchive}
        onSubmit={this.handleArchive}
        show={showArchiveModal}
        key="archiveModal"
      />,
    ]
  }
}

const mapStateToProps = state => ({
  loading: state.loading.models.talents,
  jobs: state.global.jobs,
})

export default connect(mapStateToProps)(Talents)
