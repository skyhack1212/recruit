import React from 'react'
import {Modal, Avatar, Button, Popover, Select} from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './chatting.less'

class Chatting extends React.Component {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    show: PropTypes.bool,
    initMessage: PropTypes.string.isRequired,
    titlePre: PropTypes.string,
    showPosition: PropTypes.bool,
    allJobs: PropTypes.array,
  }

  static defaultProps = {
    show: false,
    titlePre: '邀请',
    showPosition: false,
    allJobs: [],
  }

  state = {
    message: '',
    jid: '',
  }

  handleJidChange = jid => {
    const job = this.props.allJobs.find(R.propEq('jid', jid))
    this.setState({
      jid,
      message: `请问您对我发布的 "${R.propOr(
        '',
        'position',
        job
      )}" 职位感兴趣吗？`,
    })
  }

  handleMessageChange = e => {
    this.setState({message: e.target.value})
  }

  handleSend = () => {
    this.setState({message: '', jid: ''})
    this.props.onSend(this.state.message, this.state.jid)
  }

  handleCancel = () => {
    this.setState({message: '', jid: ''})
    this.props.onCancel()
  }

  renderSingleMessage = talent => {
    const {avatar} = talent
    return (
      <p className={styles.initMessagePanel}>
        <Avatar src={avatar} className={styles.avatar} />
        <span className={styles.initMessage}>
          <span>{this.props.initMessage}</span>
        </span>
      </p>
    )
  }

  renderMultiMessage = talents =>
    talents.slice(0, 12).map(item => (
      <Popover content={item.name} trigger="hover" key={item.name}>
        <Avatar src={item.avatar} className={styles.avatar} key={item.name} />
      </Popover>
    ))

  render() {
    const {talents, titlePre} = this.props
    const {length} = talents
    const title = R.slice(0, 3, talents)
      .map(R.prop('name'))
      .join('、')

    const renderOption = item => (
      <Select.Option value={item.jid} key={item.jid}>
        {item.position}
      </Select.Option>
    )

    return (
      <Modal
        title={`${titlePre} ${title} ${length > 3 ? ` 等${length}人` : ''}`}
        visible={this.props.show}
        onCancel={this.handleCancel}
        footer={
          <Button
            type="primary"
            onClick={this.handleSend}
            disabled={!this.state.message}
            className={styles.sendButton}
          >
            发送消息
          </Button>
        }
      >
        <div>
          {talents.length === 1 && this.renderSingleMessage(talents[0])}
          {talents.length > 1 && this.renderMultiMessage(talents)}
        </div>
        {this.props.showPosition && (
          <div className={styles.positionSelection}>
            {
              // <h4 className={styles.itemTitle}>邀请候选人加入职位</h4>
            }
            <Select
              showSearch
              style={{width: '100%'}}
              placeholder="选择邀请的职位"
              optionFilterProp="children"
              onChange={this.handleJidChange}
              value={this.state.jid}
            >
              {this.props.allJobs.map(renderOption)}
            </Select>
          </div>
        )}
        <p className={styles.messagePanel}>
          <textarea
            onChange={this.handleMessageChange}
            value={this.state.message}
            className={styles.messageInput}
            placeholder="请输入信息"
          />
        </p>
        {/* this.props.showPosition && (
          <p className={styles.tip}>提示：请选择职位后，填写邀请消息！</p>
        ) */}
      </Modal>
    )
  }
}

export default Chatting
