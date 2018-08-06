import React from 'react'
import {connect} from 'dva'
import PositionEdit from 'components/Position/Edit'
import {message} from 'antd'

class Create extends React.PureComponent {
  state = {
    data: {},
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchDictionary = () =>
    this.props.dispatch({
      type: 'global/fetchDictionary',
    })

  fetchData = () => {
    this.props
      .dispatch({
        type: 'positions/fetchDetailForEdit',
      })
      .then(({job = {}}) => {
        this.setState({
          data: job,
        })
      })
  }

  handleSubmit = data =>
    this.props
      .dispatch({
        type: 'positions/add',
        payload: {
          data,
        },
      })
      .then(() => {
        message.success('添加职位信息成功')
        setTimeout(() => this.props.history.push('/ent/positions'), 2000)
      })

  render() {
    const {dictionary, history} = this.props
    return (
      <div>
        <PositionEdit
          data={this.state.data}
          onSubmit={this.handleSubmit}
          dictionary={dictionary}
          history={history}
        />
      </div>
    )
  }
}

export default connect(state => ({
  loading: state.loading.models.contractTemplates,
  dictionary: state.positions.dictionary,
}))(Create)
