import React from 'react'
import PropTypes from 'prop-types'

import CategorySelection from 'components/Common/talentAdvancedSearch/category'
import ResumeSourceSelection from 'components/Common/talentAdvancedSearch/resumeSource'

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
    return (
      <div>
        <CategorySelection
          onChange={this.handleValueChange('category')}
          value={this.props.data.category}
        />
        <ResumeSourceSelection
          onChange={this.handleValueChange('source')}
          value={this.props.data.source}
        />
      </div>
    )
  }
}

export default AdvancedSearch
