import React from 'react'
import {connect} from 'dva'
import PositionEdit from 'components/Position/Common/Edit'
import {isEmpty} from 'utils'
import {message} from 'antd'
import AdvancedSearch from 'components/Position/Create/AdvancedSearch'
import Layout from 'components/Layout/MenuContentSider.js'
import Menu from 'components/Position/Common/Menu'
import Sider from 'components/Layout/CommonRightSider'

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
      advancedSearch: {},
    }
  }

  componentDidMount() {
    this.fetchData()
  }

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
          data: {
            ...data,
            jid: this.state.data.jid,
            salary: 7, // salary 固定在传 7 的情况下，会使用 salary_min 和 salary_max 字段作为薪酬的值
          },
          webjid: this.state.webjid,
          jid: this.state.jid,
        },
      })
      .then(() => {
        message.success('修改职位信息成功，即将跳转到列表页')
        setTimeout(() => this.props.history.push('/ent/positions'), 2000)
      })
  }

  handleAdvancedSearchChange = advancedSearch =>
    this.setState({advancedSearch}, this.refreshData)

  render() {
    const {dictionary, history} = this.props
    const {advancedSearch} = this.state
    return (
      <Layout>
        <Menu activeMenu="create" key="menu" />
        <div key="content">
          <PositionEdit
            data={this.state.data}
            onSubmit={this.handleSubmit}
            dictionary={dictionary}
            history={history}
          />
        </div>
        <Sider key="sider">
          <AdvancedSearch
            data={advancedSearch}
            onChange={this.handleAdvancedSearchChange}
          />
        </Sider>
      </Layout>
    )
  }
}

export default connect(state => ({
  loading: state.loading.models.contractTemplates,
  dictionary: state.positions.dictionary,
}))(Create)
