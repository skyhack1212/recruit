import React from 'react'
import {Modal, Avatar, Button, Popover} from 'antd'
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
  }

  static defaultProps = {
    show: false,
  }

  state = {
    message: '',
  }

  handleMessageChange = e => {
    this.setState({message: e.target.value})
  }

  handleSend = () => {
    this.props.onSend(this.state.message)
  }

  handleCancel = () => {
    this.setState({message: ''})
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
    const {talents} = this.props
    const {length} = talents
    const title = R.slice(0, 3, talents)
      .map(R.prop('name'))
      .join('、')

    return (
      <Modal
        title={`联系 ${title} ${length > 3 ? ` 等${length}人` : ''}`}
        visible={this.props.show}
        onCancel={this.handleCancel}
        footer={
          <Button
            type="primary"
            onClick={this.handleSend}
            disabled={!this.state.message}
          >
            发送
          </Button>
        }
      >
        <div>
          {talents.length === 1 && this.renderSingleMessage(talents[0])}
          {talents.length > 1 && this.renderMultiMessage(talents)}
        </div>
        <p className={styles.messagePanel}>
          <textarea
            onChange={this.handleMessageChange}
            value={this.state.message}
            className={styles.messageInput}
            placeholder="请输入信息"
          />
        </p>
      </Modal>
    )
  }
}

export default Chatting
