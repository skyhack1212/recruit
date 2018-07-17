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
  }

  static defaultProps = {
    checked: false,
    showPhone: false,
    showResume: false,
  }

  state = {}

  redirectToDetail = () => {
    // this.props.history.push(this.props.data.detail_url)
    // console.log('redirect')
  }

  handleCheck = e => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }

  render() {
    return (
      <div className={styles.cardItem}>
        <Checkbox
          checked={this.props.checked}
          onChange={this.handleCheck}
          className={styles.checkbox}
        />
        <div className={styles.basicInfo} onClick={this.redirectToDetail}>
          <TalentBasicInfo
            data={this.props.data}
            showPhone={this.props.showPhone}
            showResume={this.props.showResume}
          />
        </div>
        <div className={styles.operation}>{this.props.children}</div>
      </div>
    )
  }
}

export default TalentCard
