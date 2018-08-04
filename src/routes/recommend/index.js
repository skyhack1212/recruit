import React from 'react'
import {connect} from 'dva'
import * as R from 'ramda'
import JobSelect from 'components/Resume/JobSelect'
import List from 'components/Common/List'

import TalentCard from 'components/Recommend/TalentCard'

class Recommends extends React.Component {
  state = {
    data: [],
    page: 0,
    job: '',
    remain: 0,
  }

  componentWillMount() {
    this.fetchJobs()
  }

  fetchJobs = () => {
    return this.props
      .dispatch({
        type: 'global/fetchJos',
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
        },
      })
      .then(this.refreshData)

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
          onSetFit={this.handleSetFit}
          onSetUnfit={this.handleSetUnfit}
        />
      ))}
    </div>
  )

  render() {
    const {loading = false} = this.props
    const {data, remain} = this.state

    return [
      this.renderSearch(),
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        dataLength={data.length}
        remain={remain}
        key="list"
        search={this.state.job}
      />,
    ]
  }
}

const mapStateToProps = state => ({
  loading: state.loading.models.recommends,
  jobs: state.global.jobs,
})

export default connect(mapStateToProps)(Recommends)
