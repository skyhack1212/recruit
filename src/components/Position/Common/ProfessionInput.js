import React from 'react'
import PropTypes from 'prop-types'
import getFormItem from 'utils/getFormItem'
import * as R from 'ramda'

import styles from './professionInput.less'

export default class ProfessionInput extends React.Component {
  static Proptype = {
    values: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    dictionary: PropTypes.object,
  }

  static defaultProps = {
    dictionary: {},
  }
  constructor(props) {
    super(props)

    const value = props.values || {}
    this.state = {
      profession: R.propOr('', 'profession', value),
      major: R.propOr('', 'major', value),
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const {value} = nextProps
      this.setState(value)
    }
  }

  getProfessionOptions = () => {
    const {pfmj = []} = this.props.dictionary
    return pfmj.map(item => ({
      label: item.name,
      key: item.name,
    }))
  }

  getMajorOptions = () => {
    const {pfmj = []} = this.props.dictionary
    const majors = R.propOr(
      [],
      'majors',
      R.find(R.propEq('name', this.state.profession), pfmj)
    )
    return majors.map(item => ({
      label: item.name,
      key: item.name,
    }))
  }

  handleProfessionChange = profession => {
    const {onChange} = this.props
    const data = {
      ...this.state,
      profession,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  handleMajorChange = major => {
    const {onChange} = this.props
    const data = {
      ...this.state,
      major,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  render() {
    return (
      <span className={styles.profession}>
        {getFormItem({
          type: 'Select',
          options: this.getProfessionOptions(),
          config: {
            onChange: this.handleProfessionChange,
            key: 'profession',
            className: styles.professionItem,
            showSearch: true,
            placeholder: '请选择方向',
            value: this.state.profession,
          },
        })}
        {getFormItem({
          type: 'Select',
          options: this.getMajorOptions(),
          config: {
            onChange: this.handleMajorChange,
            key: 'major',
            className: styles.professionItem,
            showSearch: true,
            placeholder: '请选择职位',
            value: this.state.major,
          },
        })}
      </span>
    )
  }
}
