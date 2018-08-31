import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Checkbox} from 'antd'

@connect(state => ({
  dictionary: state.global.dictionary,
}))
class AdvancedSearch extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = props.data
  }

  handleValueChange = key => value => {
    this.setState(
      {
        [key]: value,
      },
      () => {
        this.props.onChange(this.state)
      }
    )
  }

  render() {
    const options = [
      {label: '自动过滤匹配度低的简历', value: 'mismatching', disabled: true},
    ]

    return (
      <div>
        <h3>系统过滤</h3>
        <Checkbox.Group
          options={options}
          onChange={this.handleValueChange('filter')}
          value={this.props.data.filter}
        />
      </div>
    )
  }
}

export default AdvancedSearch
