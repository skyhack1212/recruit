import React from 'react'
import {Radio, Select} from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './common.less'

const {Option} = Select

export default class City extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultCities: PropTypes.array,
    allCities: PropTypes.array,
    value: PropTypes.string,
  }

  static defaultProps = {
    defaultCities: [
      '北京-北京',
      '上海-上海',
      '广东-广州',
      '广东-深圳',
      '浙江-杭州',
      '重庆-重庆',
      '四川-成都',
      '湖北-武汉',
    ],
    allCities: [],
    value: '北京-北京',
  }

  state = {
    extraCity: '',
    value: '北京-北京',
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({
        value: this.getCityCompleteName(newProps.value) || '北京-北京',
      })
    }
  }

  getCityCompleteName = city =>
    this.props.allCities.find(item => item.split('-')[1] === city)

  handleExtraCityChange = extraCity => {
    this.setState({extraCity})
    this.props.onChange(extraCity.split('-')[1])
  }

  handleChange = e => {
    this.props.onChange(R.propOr('北京', 1, e.target.value.split('-')))
  }

  render() {
    const {allCities, defaultCities} = this.props
    const {extraCity, value} = this.state
    const showCities = R.uniq([
      ...defaultCities,
      ...(extraCity ? [extraCity] : []),
    ])
    const labels = showCities.map(item => (
      <Radio.Button key={item} value={item}>
        {R.propOr('北京', 1, item.split('-'))}
      </Radio.Button>
    ))
    const allCityOptions = allCities.map(item => (
      <Option value={item} key={item}>
        {R.propOr('北京', 1, item.split('-'))}
      </Option>
    ))
    return (
      <div className={styles.city}>
        <h3>城市</h3>
        <div>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={this.handleChange}
          >
            {labels}
          </Radio.Group>
          <Select
            showSearch
            style={{width: 230}}
            placeholder="按城市名称或省份搜索"
            optionFilterProp="value"
            onChange={this.handleExtraCityChange}
          >
            {allCityOptions}
          </Select>
        </div>
      </div>
    )
  }
}
