import React from 'react'
import PropTypes from 'prop-types'
import {Checkbox} from 'antd'

import TalentBasicInfo from './TalentBasicInfo'

import styles from './TalentCard.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onCheck: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    showPhone: PropTypes.bool,
    showResume: PropTypes.bool,
    showCheckbox: PropTypes.bool,
  }

  static defaultProps = {
    checked: false,
    showPhone: false,
    showResume: false,
    showCheckbox: false,
  }

  state = {}

  redirectToDetail = () => {
    window.open(this.props.data.detail_url, '_self')
  }

  handleCheck = e => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }

  render() {
    return (
      <div className={styles.cardItem}>
        {this.props.showCheckbox && (
          <Checkbox
            checked={this.props.checked}
            onChange={this.handleCheck}
            className={styles.checkbox}
          />
        )}
        <div
          className={styles.basicInfo}
          onClick={this.redirectToDetail}
          name="talentCard"
        >
          <TalentBasicInfo
            data={this.props.data}
            showPhone={this.props.showPhone}
            showResume={this.props.showResume}
            showPosition={this.props.showPosition}
            buttons={this.props.buttons}
          />
        </div>
      </div>
    )
  }
}

export default TalentCard
