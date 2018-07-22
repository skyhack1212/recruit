import React from 'react'
import {Checkbox, Button, Modal} from 'antd'
import PropTypes from 'prop-types'

import styles from './archiveModal.less'

export default class ArchiveModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    jobs: PropTypes.array.isRequired,
  }

  static defaultProps = {
    loading: false,
  }

  state = {
    value: '',
  }

  handleChange = value => () => {
    this.setState({
      value,
    })
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.value)
    this.setState({
      value: '',
    })
  }

  handleCancel = () => {
    this.setState({
      value: '',
    })
    this.props.onCancel()
  }

  renderItem = item => {
    const {jid, position} = item
    const key = `position${jid}`
    return (
      <label className={styles.archiveJobItem} key={key} htmlFor={key}>
        <span className={styles.archiveJobItemName}>{position}</span>
        <Checkbox
          onClick={this.handleChange(jid)}
          id={key}
          checked={this.state.value === jid}
        />
      </label>
    )
  }

  render() {
    const {loading, show} = this.props
    const footer = [
      <Button
        type="primary"
        key="archiveButton"
        loading={loading}
        onClick={this.handleSubmit}
        className={styles.archiveButton}
        disabled={!this.state.value}
      >
        归档
      </Button>,
    ]

    return (
      <Modal
        visible={show}
        title="归档"
        onCancel={this.handleCancel}
        footer={footer}
        key="archiveModal"
        className={styles.archiveContainer}
      >
        {this.props.jobs.map(this.renderItem)}
      </Modal>
    )
  }
}
