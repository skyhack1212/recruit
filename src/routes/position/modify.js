import React from 'react'
import {connect} from 'dva'
import PositionEdit from 'components/Position/Edit'
import {isEmpty} from 'utils'
import {message} from 'antd'

class Create extends React.PureComponent {
  constructor(props) {
    super(props)
    const {id} = props.match.params
    if (isEmpty(id)) {
      props.history.push('/ent/positions')
    }
    this.state = {
      data: {},
      webjid: id,
    }
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
        payload: {
          webjid: this.state.webjid,
        },
      })
      .then(({job = {}}) => {
        this.setState({
          data: job,
        })
      })
  }

  handleSubmit = data => {
    this.props
      .dispatch({
        type: 'positions/add',
        payload: {
          data,
          webjid: this.state.webjid,
        },
      })
      .then(() => {
        message.success('修改职位信息成功，即将跳转到列表页')
        setTimeout(() => this.props.history.push('/ent/positions'), 2000)
      })
  }

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
