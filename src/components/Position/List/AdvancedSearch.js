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
    const {data} = this.props
    const categoryOptions = [
      {label: '有效职位', value: 'valid'},
      {label: '已关闭职位', value: 'close'},
    ]

    return (
      <div>
        <div>
          <h3>职位状态筛选</h3>
          <Checkbox.Group
            options={categoryOptions}
            onChange={this.handleValueChange('state')}
            value={data.state}
          />
        </div>
      </div>
    )
  }
}

export default AdvancedSearch
