import React from 'react'
import {Checkbox} from 'antd'
import PropTypes from 'prop-types'
import styles from './common.less'

export default class Category extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = value => {
    this.props.onChange(value)
  }

  render() {
    const {value} = this.props
    const options = [
      {label: '系统推荐', value: 'recommend'},
      {label: '主动投递', value: 'delivery'},
      {label: '搜索', value: 'search'},
    ]

    return (
      <div className={styles.resumeSource}>
        <h3>简历来源</h3>
        <Checkbox.Group
          options={options}
          onChange={this.handleChange}
          value={value}
        />
      </div>
    )
  }
}
