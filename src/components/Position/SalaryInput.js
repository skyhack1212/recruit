import React from 'react'
import PropTypes from 'prop-types'
import getFormItem from 'utils/getFormItem'
import * as R from 'ramda'

import styles from './salaryInput.less'

export default class SalaryInput extends React.Component {
  static Proptype = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dictionary: {},
  }
  constructor(props) {
    super(props)

    const value = props.values || {}
    this.state = {
      salary_min: R.propOr('', 'salary_min', value),
      salary_max: R.propOr('', 'salary_max', value),
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const {value} = nextProps
      this.setState(value)
    }
  }

  handleMinChange = e => {
    e.preventDefault()
    const {onChange} = this.props
    const data = {
      ...this.state,
      salary_min: e.target.value,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  handleMaxChange = e => {
    e.preventDefault()
    const {onChange} = this.props
    const data = {
      ...this.state,
      salary_max: e.target.value,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  render() {
    return (
      <span className={styles.salary}>
        {getFormItem({
          type: 'Input',
          config: {
            onChange: this.handleMinChange,
            key: 'min',
            className: styles.salaryItem,
            suffix: 'K/月',
            type: 'number',
            placeholder: '请输入薪资下限',
            value: this.state.salary_min,
          },
        })}
        <span>~</span>
        {getFormItem({
          type: 'Input',
          config: {
            onChange: this.handleMaxChange,
            key: 'max',
            className: styles.salaryItem,
            suffix: 'K/月',
            type: 'number',
            placeholder: '请输入薪资上线，如果不填，则代表无上限',
            value: this.state.salary_max,
          },
        })}
      </span>
    )
  }
}
