import React from 'react'
import PropTypes from 'prop-types'
import {Select} from 'antd'

export default class JobSelect extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    value: '',
  }

  handleChange = jid => {
    this.props.onChange(jid)
  }

  render() {
    const jobOptions = this.props.data.map(item => (
      <Select.Option key={item.jid} value={item.jid}>
        {item.position}
      </Select.Option>
    ))
    const {value} = this.props

    return (
      <Select
        showSearch
        allowClear
        style={{width: 200}}
        placeholder="按照职位筛选"
        optionFilterProp="children"
        onChange={this.props.onChange}
        value={!value ? undefined : value}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {jobOptions}
      </Select>
    )
  }
}
