import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Form} from 'antd'

@connect(state => ({
  dictionary: state.global.dictionary,
}))
@Form.create()
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
    // const {data} = this.props
    return <div>这里是待开发的荒原！</div>
  }
}

export default AdvancedSearch
