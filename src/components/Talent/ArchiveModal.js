import React from 'react'
import {Checkbox, Button, Modal, Input} from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

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

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      jobs: props.jobs,
      search: '',
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      jobs: props.jobs,
    })
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
      search: '',
    })
  }

  handleCancel = () => {
    this.setState({
      value: '',
      search: '',
    })
    this.props.onCancel()
  }

  handleSearch = value => {
    this.setState({
      jobs: this.props.jobs.filter(
        item => R.toLower(item.position).indexOf(R.toLower(value)) !== -1
      ),
    })
  }

  handleBlurSearch = e => {
    this.handleSearch(e.target.value)
  }

  handleSearchChange = e => {
    this.setState({
      search: e.target.value,
    })
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
        <Input.Search
          onSearch={this.handleSearch}
          onBlur={this.handleBlurSearch}
          onChange={this.handleSearchChange}
          className={styles.searchInput}
          value={this.state.search}
          placeholder="请输入搜索关键词"
        />
        {this.state.jobs.map(this.renderItem)}
      </Modal>
    )
  }
}
