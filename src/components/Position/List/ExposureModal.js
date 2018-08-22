import React from 'react'
import {Modal, Button} from 'antd'
import * as R from 'ramda'
import PropTypes from 'prop-types'

import styles from './exposureModal.less'

export default class MModal extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
  }

  renderUnstartContent = () => {
    const {data} = this.props
    return (
      <div>
        <h3 className={styles.title}>{data.position}</h3>
        <p className={styles.tip}>
          将职位立即曝光给符合条件的活跃高端人才，快速获取简历，告别漫长等待。
        </p>
        <div className={styles.statisticContent}>
          <div>
            <h4 className={styles.statisticContentTitle}>专享服务</h4>
          </div>
          <ul>
            <li>比同行抢先获取活跃高端人才；</li>
            <li>简历投递量、职位查看量预计提升 5~10 倍；</li>
            <li>实时数据监控，使用效果一目了然。</li>
          </ul>
        </div>
      </div>
    )
  }

  renderStatisticContent = () => {
    const {data} = this.props
    return (
      <div>
        <h3 className={styles.title}>{data.position}</h3>
        <div className={styles.statisticContent}>
          <div>
            <h4 className={styles.statisticContentTitle}>数据汇总</h4>
          </div>
          <ul>
            <li>
              预计曝光3天，当前第
              <font className={styles.emphasizeFont}>{data.days}</font>
              天
            </li>
            <li>
              已将职位送达
              <font className={styles.emphasizeFont}>{data.push_cnt}</font>
              位候选人
            </li>
            <li>
              已有
              <font className={styles.emphasizeFont}>{data.view_cnt}</font>
              位候选人查看了职位
            </li>
            <li>
              已收到
              <font className={styles.emphasizeFont}>{data.resume_cnt}</font>
              份简历
            </li>
          </ul>
        </div>
      </div>
    )
  }

  renderTipContent = () => {
    const {data} = this.props
    return (
      <div>
        <h3 className={styles.title}>{data.position}</h3>
        <div className={styles.statisticContent}>
          <div>
            <h4 className={styles.statisticContentTitle}>数据汇总</h4>
          </div>
          <p className={styles.textCenter}>{data.pre_comment}</p>
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {data} = this.props
    const renderCondition = R.cond([
      [() => data.status === 0 && !data.pre_comment, this.renderUnstartContent],
      [() => data.status === 0 && data.pre_comment, this.renderTipContent],
      [() => data.status === 1, this.renderStatisticContent],
    ])
    return renderCondition()
  }

  renderFooter = () => {
    const {data} = this.props
    const renderCondition = R.cond([
      [
        () => data.status === 0 && !data.pre_comment,
        () => (
          <Button
            onClick={this.props.onSubmit}
            type="primary"
            className={styles.submitButton}
          >
            开始极速曝光
          </Button>
        ),
      ],
      [
        () => data.status === 0 && data.pre_comment,
        () => (
          <Button
            onClick={this.props.onCancel}
            type="primary"
            className={styles.submitButton}
          >
            已提交，关闭页面
          </Button>
        ),
      ],
      [
        () => data.status === 1,
        () => (
          <Button
            onClick={this.props.onCancel}
            type="primary"
            className={styles.submitButton}
          >
            持续曝光中...
          </Button>
        ),
      ],
    ])
    return renderCondition()
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        title="极速曝光"
        onOk={this.props.onSubmit}
        onCancel={this.props.onCancel}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </Modal>
    )
  }
}
