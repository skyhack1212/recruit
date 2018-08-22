import React from 'react'
import PropTypes from 'prop-types'
import getFormItem from 'utils/getFormItem'
import * as R from 'ramda'

import styles from './locationInput.less'

export default class LocationInput extends React.Component {
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
      province: R.propOr('', 'province', value),
      city: R.propOr('', 'city', value),
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const {value} = nextProps
      this.setState(value)
    }
  }

  getProvinceOptions = () => {
    const {loc = []} = this.props.dictionary
    return loc.map(item => ({
      label: item.province,
      key: item.province,
    }))
  }

  getCityOptions = () => {
    const {loc = []} = this.props.dictionary
    const cities = R.propOr(
      [],
      'cities',
      R.find(R.propEq('province', this.state.province), loc)
    )
    return cities.map(item => ({
      label: item.city,
      key: item.city,
    }))
  }

  handleProvinceChange = province => {
    const {onChange} = this.props
    const data = {
      ...this.state,
      province,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  handleCityChange = city => {
    const {onChange} = this.props
    const data = {
      ...this.state,
      city,
    }
    this.setState(data)
    if (onChange) {
      onChange(data)
    }
  }

  render() {
    return (
      <span className={styles.location}>
        {getFormItem({
          type: 'Select',
          options: this.getProvinceOptions(),
          config: {
            onChange: this.handleProvinceChange,
            key: 'province',
            className: styles.locationItem,
            showSearch: true,
            placeholder: '请选择省份',
            value: this.state.province,
          },
        })}
        {getFormItem({
          type: 'Select',
          options: this.getCityOptions(),
          config: {
            onChange: this.handleCityChange,
            key: 'city',
            className: styles.locationItem,
            showSearch: true,
            placeholder: '请选择城市',
            value: this.state.city,
          },
        })}
      </span>
    )
  }
}
