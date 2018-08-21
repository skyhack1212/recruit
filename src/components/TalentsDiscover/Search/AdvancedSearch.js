import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Form} from 'antd'

import {flatternCities} from 'utils/talentDiscover'
import CitySelection from 'components/Common/talentAdvancedSearch/city'
import WorktimeSelection from 'components/Common/talentAdvancedSearch/worktime'
import DegreeSelection from 'components/Common/talentAdvancedSearch/degree'
import CompanyLevelSelection from 'components/Common/talentAdvancedSearch/companyLevel'
import SchollLevelOption from 'components/Common/talentAdvancedSearch/schollLevel'

@connect(state => ({
  dictionary: state.global.dictionary,
}))
@Form.create()
class AdvancedSearch extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
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
    const {dictionary, data} = this.props
    return (
      <div>
        <CitySelection
          onChange={this.handleValueChange('city')}
          allCities={flatternCities(dictionary.loc)}
          value={data.city}
        />
        <WorktimeSelection
          onChange={this.handleValueChange('work_time')}
          value={data.work_time}
        />
        <DegreeSelection
          onChange={this.handleValueChange('degree')}
          value={data.degree}
        />
        <CompanyLevelSelection
          onChange={this.handleValueChange('company_level')}
          value={data.company_level}
        />
        <SchollLevelOption
          onChange={this.handleValueChange('is_211_985')}
          value={data.is_211_985}
        />
      </div>
    )
  }
}

export default AdvancedSearch
