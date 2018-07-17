import React from 'react'
import {Icon, Popover} from 'antd'
import PropTypes from 'prop-types'

import styles from './TalentBasicInfo.less'

class TalentBasicInfo extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showPhone: PropTypes.bool,
    showResume: PropTypes.bool,
  }

  static defaultProps = {
    showPhone: false,
    showResume: false,
  }

  handleStarChange = () => {
    // const {data: {id}} = this.props
  }

  renderPhone = phone => (
    <Popover content={phone} trigger="click">
      <Icon type="phone" className={styles.phoneIcon} />
    </Popover>
  )

  renderResume = (resumeUrl, resumeName) => (
    <Popover
      content={<a href={resumeUrl}>{resumeName || '点击下载简历'}</a>}
      trigger="click"
    >
      <Icon type="file-text" className={styles.resumeIcon} />
    </Popover>
  )

  render() {
    const {data, showPhone, showResume} = this.props
    const {
      name,
      gender_str: gender,
      major,
      city,
      large_comps: company,
      worktime,
      province,
      tags,
      avatar,
      sdegree,
      school,
      mobile = '13811104415',
      resume_url: resumeUrl = 'http://www.baidu.com',
      resume_name: resumeName,
      star,
    } = data

    const starType = star ? 'star' : 'star-o'

    return [
      <img src={avatar} alt="avatar" className={styles.avatar} key="avatar" />,
      <div key="info" className={styles.info}>
        <div>
          <span className={styles.title}>{name}</span>
          {major}
          <Icon
            type={starType}
            onClick={this.handleStarChange}
            className={styles.starIcon}
          />
          {showPhone && mobile ? this.renderPhone(mobile) : null}
          {showResume && resumeUrl
            ? this.renderResume(resumeUrl, resumeName)
            : null}
        </div>
        <div className={styles.infoLine}>
          {`${province} - ${city}/${gender}/${sdegree}/${worktime}`}
        </div>
        <div className={styles.infoLine}>曾任职于：{company}</div>
        <div className={styles.infoLine}>曾就读于：{school}</div>
        <div className={styles.infoLine}> 技能标签：{tags}</div>
      </div>,
    ]
  }
}

export default TalentBasicInfo
