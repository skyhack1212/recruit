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
      // isStar: props.star,
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
          // isStar,
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
      content={<a href={resumeUrl}>{resumeName || '点击下载简历'}</a>}
      trigger="hover"
    >
      <Icon type="file-text" className={styles.resumeIcon} />
    </Popover>
  )

  render() {
    const {data, showPhone, showResume} = this.props
    const {
      // id,
      name,
      gender_str: gender,
      major = '未知专业',
      city = '未知城市',
      large_comps: company = '未知公司',
      worktime = '未知工作年限',
      province = '未知省份',
      tags = '未知标签',
      avatar,
      sdegree = '未知学历',
      school = '未知学校',
      mobile,
      resume_url: resumeUrl,
      resume_name: resumeName,
    } = data
    // const {isStar} = this.state

    // const starType = isStar ? 'star' : 'star-o'

    return [
      <img src={avatar} alt="avatar" className={styles.avatar} key="avatar" />,
      <div key="info" className={styles.info}>
        <div name="infoLine">
          <span className={styles.title}>{name}</span>
          {major}
          {/* <Icon
            type={starType}
            onClick={this.handleStarChange(!isStar, id)}
            className={styles.starIcon}
          /> */}
          {showPhone && mobile ? this.renderPhone(mobile) : null}
          {showResume && resumeUrl
            ? this.renderResume(resumeUrl, resumeName)
            : null}
        </div>
        <div className={styles.infoLine} name="infoLine">
          {`${province} - ${city}/${gender}/${sdegree}/${worktime}`}
        </div>
        <div className={styles.infoLine} name="infoLine">
          曾任职于：{company}
        </div>
        <div className={styles.infoLine} name="infoLine">
          曾就读于：{school}
        </div>
        <div className={styles.infoLine} name="infoLine">
          {' '}
          技能标签：{tags}
        </div>
      </div>,
    ]
  }
}

export default connect()(TalentBasicInfo)
