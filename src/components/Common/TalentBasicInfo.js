import React from 'react'
import {Icon, Popover} from 'antd'
import PropTypes from 'prop-types'
import {connect} from 'dva'

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

  constructor(props) {
    super(props)
    this.state = {
      isStar: props.star,
    }
  }

  handleStarChange = (isStar, uid) => () => {
    const type = isStar ? 'global/addStar' : 'global/cancelStar'
    this.props
      .dispatch({
        type,
        payload: {
          to_uid: uid,
        },
      })
      .then(() => {
        this.setState({
          isStar,
        })
      })
  }

  renderPhone = phone => (
    <Popover content={phone} trigger="hover">
      <Icon type="phone" className={styles.phoneIcon} />
    </Popover>
  )

  renderResume = (resumeUrl, resumeName) => (
    <Popover
      content={
        <a href={resumeUrl} name="download">
          {resumeName || '点击下载简历'}
        </a>
      }
      trigger="hover"
    >
      <Icon type="file-text" className={styles.resumeIcon} />
    </Popover>
  )

  render() {
    const {data, showPhone, showResume} = this.props
    const {
      id,
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
      mobile,
      resume_url: resumeUrl,
      resume_name: resumeName,
    } = data
    const {isStar} = this.state

    const starType = isStar ? 'star' : 'star-o'

    return [
      <img src={avatar} alt="avatar" className={styles.avatar} key="avatar" />,
      <div key="info" className={styles.info}>
        <div>
          <span className={styles.title}>{name}</span>
          {major}
          <Icon
            type={starType}
            onClick={this.handleStarChange(!isStar, id)}
            className={styles.starIcon}
            name="star"
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

export default connect()(TalentBasicInfo)
