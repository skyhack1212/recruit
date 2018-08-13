import React from 'react'
import PropTypes from 'prop-types'
import {Select} from 'antd'

export default class JobSelect extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
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

    return (
      <Select
        showSearch
        allowClear
        style={{width: 200}}
        placeholder="请选择职位"
        optionFilterProp="children"
        value={this.props.value}
        onChange={this.props.onChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {jobOptions}
      </Select>
    )
  }
}
