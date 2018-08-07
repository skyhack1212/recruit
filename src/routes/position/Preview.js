import React from 'react'
import {connect} from 'dva'
import qs from 'query-string'
import * as R from 'ramda'
import {ActivityIndicator, Modal, List} from 'antd-mobile'
import {setCookie} from 'tiny-cookie'

import 'antd-mobile/lib/activity-indicator/style/index.css'
import 'antd-mobile/lib/modal/style/index.css'
import 'antd-mobile/lib/list/style/index.css'

import styles from './preview.less'

@connect(state => ({
  loading: state.loading.models.positions,
}))
export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    const search = qs.parse(window.location.search.slice(1))
    this.state = {
      job: {},
      webuid: search.webuid,
      webjid: search.webjid,
      showModal: false,
    }
  }

  componentWillMount() {
    window.auth_callback = res => {
      try {
        const {result, ...other} = JSON.parse(res)
        R.mapObjIndexed((value, key) => {
          setCookie(key, value)
        }, other)
      } catch (e) {
        console.log('something is error')
      }
    }

    if (typeof MaiMai !== 'undefined' && window.MaiMai) {
      window.MaiMai.auth('0', 'auth_callback')
    } else {
      /*
      this.setState({
        tokenInfo: {
          uid         : getCookie('u'),
          access_token: getCookie('access_token'),
          channel     : 'Beta',
          version     : '4.23.88',
        }
      }); */
      // setCookie('uid', getCookie('u'))
    }
    this.fetchJobDetail()
  }

  getValue = key => {
    const data = R.propOr('', key, this.state.job)
    const format = {
      description: v =>
        v
          .split('\n')
          .map((des, index) => des && <li key={`item${index + 1}`}>{des}</li>),
    }
    return format[key] ? format[key](data) : data
  }

  close = (tips = '', flag = true) => () => {
    if (window.parent.MaiMai_Native) {
      window.parent.MaiMai_Native.close_native(tips, flag)
    }

    if (window.MaiMai_Native) {
      window.MaiMai_Native.close_native(tips, flag)
    }
  }

  disAgreeConnect = reason => () => {
    this.props
      .dispatch({
        type: 'positions/disAgreeConnect',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
          reason,
        },
      })
      .then(this.close())
  }

  agreeConnect = state => () => {
    this.props
      .dispatch({
        type: 'positions/agreeConnect',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
          state,
        },
      })
      .then(this.close())
  }

  fetchJobDetail = () =>
    this.props
      .dispatch({
        type: 'positions/fetchDetail',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
        },
      })
      .then(({job}) => {
        this.setState({job})
      })

  handleShowModal = () => {
    this.setState({showModal: true})
  }

  handleHideModal = () => {
    this.setState({showModal: false})
  }

  renderJobTags = () => {
    const {stags = ''} = this.state.job
    const tagList = stags.split(',')
    const tag = (value, index) => (
      <span className={styles.positionDetailTag} key={`value${index + 1}`}>
        {value}
      </span>
    )
    return tagList.map(tag)
  }

  renderReasons = () => {
    const reasons = [
      '推荐我更好的机会',
      '职位不感兴趣',
      '公司不感兴趣',
      '今年不看机会',
    ]
    return reasons.map((v, i) => (
      <List.Item key={`item${i + 1}`} onClick={this.disAgreeConnect(v)}>
        {v}
      </List.Item>
    ))
  }

  render() {
    const {job, showModal} = this.state
    const {loading} = this.props
    if (loading) {
      return (
        <div className="toast-example">
          <ActivityIndicator toast text="Loading..." animating={loading} />
        </div>
      )
    }
    return (
      <div className={styles.previewMain}>
        <header>
          <h3>{this.getValue('position')}</h3>
          <p className={styles.positionProfile}>
            <span>
              {`${this.getValue('province')} | ${this.getValue(
                'sdegree'
              )} | ${this.getValue('worktime')}`}
            </span>
            <span className={styles.positionProfileSalary}>
              {this.getValue('salary')}
            </span>
          </p>
        </header>

        <div className={styles.company}>
          <img className={styles.companyLogo} src={job.clogo} alt="logo" />
          <div className={styles.companyProfile}>
            <p>{this.getValue('company')}</p>
            <p>
              {`${this.getValue('domain')}   |  ${this.getValue(
                'stage'
              )}  |  ${this.getValue('people')}`}
            </p>
          </div>
        </div>

        <div className={styles.positionDetail}>
          <h3>职位描述</h3>
          <div className={styles.positionDetailTags}>
            {this.renderJobTags()}
          </div>
          <ul className={styles.positionDetailTxt}>
            {this.getValue('description')}
          </ul>
        </div>

        <div className={styles.tip}>
          <h4 className={styles.tipTitle}>温馨提示</h4>
          <p>以担保或任何理由索取财物，扣押证照，均涉嫌违法，请提高警惕！</p>
        </div>

        {job.is_show && (
          <div className={styles.opButtons}>
            <button
              className={styles.opButtonsReject}
              onClick={this.handleShowModal}
            >
              不感兴趣
            </button>
            <button
              className={styles.opButtonsMai}
              onClick={this.agreeConnect('i')}
            >
              脉信沟通
            </button>
            <button
              className={styles.opButtonsPhone}
              onClick={this.agreeConnect('iam')}
            >
              <span className={styles.opButtonsPhoneTip}>可以</span>电话沟通
            </button>
          </div>
        )}
        <Modal
          popup
          visible={showModal}
          onClose={this.handleHideModal}
          animationType="slide-up"
          className={styles.modal}
        >
          <List
            renderHeader={() => <div>不感兴趣原因?</div>}
            className="popup-list"
          >
            {this.renderReasons()}
          </List>
        </Modal>
      </div>
    )
  }
}
