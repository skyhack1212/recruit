import React from 'react'
import {Radio} from 'antd'
import PropTypes from 'prop-types'
import {DEGREE_OPTIONS} from 'constants/position'
import styles from './common.less'

export default class Degree extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {value} = this.props
    const labels = DEGREE_OPTIONS.map(({key, label}) => (
      <Radio.Button key={key} value={key}>
        {label}
      </Radio.Button>
    ))

    return (
      <div className={styles.degree}>
        <h3>最高学历</h3>
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
