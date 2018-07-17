import React from 'react'
import {connect} from 'dva'
import * as R from 'ramda'
import {Tabs} from 'antd'
import {withRouter} from 'react-router'

class Tab extends React.PureComponent {
  constructor(props) {
    super(props)
    const {role} = this.props

    const allTabs = {
      media: [
        {
          key: 'todoList',
          label: '待开发票',
          url: '/crm-v2/invoice/todo',
        },
        {
          key: 'appliedList',
          label: '已申请发票',
          url: '/crm-v2/invoice/applied',
        },
        {
          key: 'completeList',
          label: '已完成发票',
          url: '/crm-v2/invoice/complete',
        },
      ],
      finance: [
        {
          key: 'reviewList',
          label: '待确认发票',
          url: '/crm-v2/invoice/review',
        },
        {
          key: 'completeList',
          label: '已完成发票',
          url: '/crm-v2/invoice/complete',
        },
      ],
      admin: [
        {
          key: 'todoList',
          label: '待开发票',
          url: '/crm-v2/invoice/todo',
        },
        {
          key: 'appliedList',
          label: '已申请发票',
          url: '/crm-v2/invoice/applied',
        },
        {
          key: 'completeList',
          label: '已完成发票',
          url: '/crm-v2/invoice/complete',
        },
        {
          key: 'reviewList',
          label: '待确认发票',
          url: '/crm-v2/invoice/review',
        },
      ],
    }
    const tabs = R.propOr([], role, allTabs)
    this.state = {
      tabs,
    }
  }
  handleChangeTab = tab => {
    const {tabs} = this.state
    const tabConfig = tabs.find(R.propEq('key', tab))
    this.props.history.push(tabConfig.url)
  }

  render() {
    const {tabs} = this.state

    return (
      <Tabs
        defaultActiveKey={this.props.active}
        onChange={this.handleChangeTab}
      >
        {tabs.map(item => <Tabs.TabPane key={item.key} tab={item.label} />)}
      </Tabs>
    )
  }
}

const mapStateToProps = ({users}) => {
  return {
    role: R.path(['currentUser', 'role_type'], users),
  }
}

export default withRouter(connect(mapStateToProps)(Tab))
