import React from 'react'
import {Radio} from 'antd'
import PropTypes from 'prop-types'
import {WORKTIME_OPTIONS} from 'constants/position'

import styles from './common.less'

export default class Worktime extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {value} = this.props
    const labels = WORKTIME_OPTIONS.map(({key, label}) => (
      <Radio.Button key={key} value={key}>
        {label}
      </Radio.Button>
    ))

    return (
      <div className={styles.worktime}>
        <h3>工作年限</h3>
        <div>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={this.handleChange}
          >
            {labels}
          </Radio.Group>
        </div>
      </div>
    )
  }
}
