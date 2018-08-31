import React from 'react'
import {connect} from 'dva'
import {Popover, Table, Icon} from 'antd'
import PropTypes from 'prop-types'

import AssiginedModal from './AssignedModal'

import styles from './list.less'

@connect(state => ({
  staffLoading: state.loading.models.staff,
  rightsLoading: state.loading.models.rights,
}))
export default class List extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    rights: PropTypes.array.isRequired,
  }

  state = {
    showAssignedModal: false,
    assignItem: {},
  }

  getTotal = () => {
    const {rights} = this.props
    return rights.reduce(
      (res, item) => ({
        ...res,
        [item.type]: item.left,
      }),
      {}
    )
  }

  getOpButtons = item => {
    return (
      <ul className={styles.opButtons}>
        <li>
          <span onClick={this.handleShowAssignedModal('give', item)}>
            分配资源
          </span>
        </li>
        <li>
          <span onClick={this.handleShowAssignedModal('take', item)}>
            回收资源
          </span>
        </li>
        <li>
          <span onClick={this.handleDel(item.uid)}>解除绑定</span>
        </li>
      </ul>
    )
  }

  getColumns = () => {
    const renderNumbers = (key, item) =>
      `${item[`${key}_left`]} / ${item[`${key}_total`]}`

    return [
      {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: url => (
          <img src={url} className={styles.avatar} alt="用户头像" />
        ),
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name',
        render: (value, item) => {
          return [
            <span key="name">{value}</span>,
            !item.st ? (
              <span key="status" className={styles.staffStatus}>
                (尚未接受邀请)
              </span>
            ) : null,
          ]
        },
      },
      {
        title: '加好友 余/总量',
        dataIndex: 'age',
        key: 'age',
        render: (value, item) => renderNumbers('addfr', item),
      },
      {
        title: '极速联系 余/总量',
        dataIndex: 'uh',
        key: 'uh',
        render: (value, item) => renderNumbers('uh', item),
      },
      {
        title: '索要简历 余/总量',
        dataIndex: 'req_resume',
        key: 'req_resume',
        render: (value, item) => renderNumbers('req_resume', item),
      },
      {
        title: '极速曝光 余/总量',
        dataIndex: 'exposure',
        key: 'exposure',
        render: (value, item) => renderNumbers('exposure', item),
      },
      {
        title: '职位邀请 余/总量',
        dataIndex: 'connect',
        key: 'connect',
        render: (value, item) => renderNumbers('connect', item),
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'uid',
        render: (value, item) => (
          <Popover trigger="click" content={this.getOpButtons(item)}>
            <span className={styles.op}>
              <Icon type="setting" className={styles.opIcon} />
            </span>
          </Popover>
        ),
      },
    ]
  }

  handleDel = u2 => () => {
    this.props
      .dispatch({
        type: 'staff/del',
        payload: {
          u2,
        },
      })
      .then(this.props.refresh)
  }

  handleShowAssignedModal = (assignType, assignItem) => () => {
    this.setState({
      assignType,
      assignItem,
      showAssignedModal: true,
    })
  }

  handleCancelAssignedModal = () => {
    this.setState({
      showAssignedModal: false,
    })
  }

  handleSubmitAssignedValue = data => {
    this.props
      .dispatch({
        type: `rights/${this.state.assignType}`,
        payload: {
          data: data.map(v => ({...v, u2: this.state.assignItem.uid})),
        },
      })
      .then(() => {
        this.setState({
          showAssignedModal: false,
        })
        this.props.refresh()
      })
  }

  render() {
    return (
      <div className={styles.main}>
        <Table
          dataSource={this.props.data}
          columns={this.getColumns()}
          rowKey="uid"
          pagination={false}
        />
        {this.state.showAssignedModal && (
          <AssiginedModal
            type={this.state.assignType}
            visible={this.state.showAssignedModal}
            item={this.state.assignItem}
            total={this.getTotal()}
            onSubmit={this.handleSubmitAssignedValue}
            onCancel={this.handleCancelAssignedModal}
          />
        )}
      </div>
    )
  }
}
