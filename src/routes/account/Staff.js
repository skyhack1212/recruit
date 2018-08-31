import React from 'react'
import {connect} from 'dva'
import * as R from 'ramda'
import {Button} from 'antd'

import Overview from 'components/Account/Staff/Overview'
import List from 'components/Account/Staff/List'
import AddStaffModal from 'components/Account/Staff/AddModal'

// import AdvancedSearch from 'components/Account/Staff/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/Account/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

import styles from './staff.less'

@connect(state => ({
  staffLoading: state.loading.models.staff,
  rightsLoading: state.loading.models.rights,
}))
export default class Staff extends React.PureComponent {
  state = {
    staff: [],
    rights: [],
    showAddStaffModal: false,
  }

  componentDidMount() {
    this.fetchRights()
    this.fetchStaff()
  }

  getOverviewData = () => {
    const {rights = []} = this.state
    const staffRights = R.find(R.propEq('type', 'staff'), rights) || {}
    return [
      {
        title: '剩余绑定员工数',
        value: staffRights.left,
      },
      {
        title: '已绑定员工数',
        value: staffRights.used,
      },
      {
        title: '能绑定员工数',
        value: staffRights.total,
      },
    ]
  }

  getListData = () => {
    const {staff: data} = this.state

    return data.map(({staff = {}, to_ucard: ucard = {}}) => ({
      ...staff,
      name: ucard.name,
      avatar: ucard.avatar,
      uid: ucard.id,
    }))
  }

  fetchStaff = () => {
    this.props
      .dispatch({
        type: 'staff/fetch',
      })
      .then(data => {
        this.setState({
          staff: data.data,
        })
      })
  }

  fetchRights = () => {
    this.props
      .dispatch({
        type: 'rights/fetch',
      })
      .then(({data}) => {
        this.setState({
          rights: data.rights,
        })
      })
  }

  handleShowAddStaffModal = () => {
    this.setState({
      showAddStaffModal: true,
    })
  }

  handleHideAddStaffModal = () => {
    this.setState({
      showAddStaffModal: false,
    })
  }

  handleAddStaff = payload => {
    this.props
      .dispatch({
        type: 'staff/add',
        payload,
      })
      .then(() => {
        this.handleHideAddStaffModal()
        this.fetchStaff()
      })
  }

  render() {
    const {showAddStaffModal, rights} = this.state
    return (
      <Layout>
        <Menu activeMenu="staff" key="menu" />
        <div key="content">
          <Overview data={this.getOverviewData()} />
          <List
            data={this.getListData()}
            rights={rights}
            refresh={this.fetchStaff}
          />
          <Button
            className={styles.addStaffButton}
            type="primary"
            onClick={this.handleShowAddStaffModal}
          >
            添加员工
          </Button>
          {showAddStaffModal && (
            <AddStaffModal
              visible={showAddStaffModal}
              onCancel={this.handleHideAddStaffModal}
              onSubmit={this.handleAddStaff}
            />
          )}
        </div>
        <Sider key="sider" />
      </Layout>
    )
  }
}
