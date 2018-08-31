import React from 'react'
import {connect} from 'dva'

import Overview from 'components/Account/Staff/Overview'

@connect(state => ({
  staffLoading: state.loading.models.staff,
  rightsLoading: state.loading.models.rights,
}))
class Staff extends React.PureComponent {
  state = {
    // rights: [],
  }

  componentDidMount() {
    this.fetchRights()
    this.fetchStaff()
  }

  getOverviewData = () => {
    // const {rights} = this.state
  }

  fetchRights = () => {
    this.props
      .dispatch({
        type: 'rights/fetch',
      })
      .then(() => {
        this.setState({
          // rights: data.data,
        })
      })
  }

  render() {
    return (
      <div>
        <Overview data={this.getOverviewData()} />
      </div>
    )
  }
}

export default Staff
