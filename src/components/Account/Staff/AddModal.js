import React from 'react'
import * as R from 'ramda'
import {connect} from 'dva'
import PropTypes from 'prop-types'
import {Modal, Button, Input} from 'antd'

import styles from './addModal.less'

@connect(state => ({
  staffLoading: state.loading.models.staff,
  rightsLoading: state.loading.models.rights,
}))
export default class AssignedModal extends React.PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
  }

  state = {
    info: {},
    showInfo: false,
    mobileError: false,
  }

  handleShowInfo = mobile => {
    const formatMobile = Number(R.trim(mobile))
    if (`${formatMobile}`.length !== 11) {
      this.setState({
        mobileError: true,
        info: {},
        showInfo: false,
      })
      return
    }

    if (formatMobile === this.state.info.mobile) {
      return
    }

    this.setState(
      {
        showInfo: true,
        mobileError: false,
        info: {},
      },
      () => this.fetchStaffInfo(formatMobile)
    )
  }

  handleShowInfoBlur = e => {
    this.handleShowInfo(e.target.value)
  }

  fetchStaffInfo = mobile => {
    this.props
      .dispatch({
        type: 'staff/fetchInfoByMobile',
        payload: {
          mobile,
        },
      })
      .then(data => {
        const info = {
          ...data.ucard2,
          mobile,
        }
        this.setState({
          info,
        })
      })
  }

  handleSubmit = () => {
    this.props.onSubmit({
      u2: this.state.info.id,
      mobile: this.state.info.mobile,
    })
  }

  render() {
    const {info, mobileError, showInfo} = this.state
    return (
      <Modal
        title="添加新员工"
        onCancel={this.props.onCancel}
        className={styles.modal}
        visible={this.props.visible}
        width={600}
        height={200}
        maskClosable={false}
        footer={[
          <Button
            className={styles.button}
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
            disabled={R.isEmpty(info)}
          >
            {`确定添加员工`}
          </Button>,
        ]}
      >
        <div className={styles.search}>
          <Input.Search
            placeholder="请输入员工手机号"
            type="number"
            onSearch={this.handleShowInfo}
            onBlur={this.handleShowInfoBlur}
            style={{width: '100%'}}
          />
          {mobileError && (
            <p className={styles.tip}>手机格式错误，请重新输入</p>
          )}
        </div>
        {showInfo &&
          (!R.isEmpty(info) ? (
            <div className={styles.staffInfo}>
              <img src={info.avatar} alt="头像" className={styles.avatar} />
              <span>{info.name}</span>
              <span>{info.province}</span>
              <span>{info.career}</span>
              <p className={styles.alert}>
                确认加入后该用户企业招聘版身份将丢失
              </p>
            </div>
          ) : (
            <div className={styles.staffInfo}>
              <p className={styles.infoTip}>未找到该用户</p>
            </div>
          ))}
      </Modal>
    )
  }
}
