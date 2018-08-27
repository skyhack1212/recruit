import React from 'react'
import {Icon, Popover} from 'antd'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import * as R from 'ramda'

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

  PopLine = props => (
    <Popover content={props.content} trigger="hover">
      {this.props.children}
    </Popover>
  )

  renderPhone = phone => (
    <span className={styles.phone}>
      <Icon type="phone" className={styles.phoneIcon} /> {phone}
    </span>
  )

  renderResume = (resumeUrl, resumeName) => (
    <span>
      <a href={resumeUrl}>{resumeName}</a>
    </span>
  )

  renderTags = (tags = '') =>
    tags.split(',').map(item => (
      <span key={item} className={styles.baseInfoBriefTag}>
        {item}
      </span>
    ))

  renderExp = (exp = []) => {
    const {length} = exp
    const renderItem = (item, index) => (
      <span className={styles.baseInfoExpItem}>
        <font key="company">{item.company}</font>
        {' - '}
        <font key="position">{item.position}</font>
        <font key="workexp">（{item.v}）</font>
        <font className={styles.colorBlue} key="worktime">
          {item.worktime}
        </font>
        {length > 3 &&
          index === 2 && (
            <span className={styles.baseInfoBriefMore} key="more">
              ...
            </span>
          )}
      </span>
    )
    return (
      <Popover
        content={
          <span className={styles.baseInfoExpPop}>{exp.map(renderItem)}</span>
        }
        className={styles.baseInfoExpContent}
      >
        {exp.slice(0, 3).map(renderItem)}
      </Popover>
    )
  }

  renderEdu = (edu = []) => {
    const renderItem = item => [
      <span key="scholl">{item.school}</span>,
      ' - ',
      <span className={styles.colorLightBlack} key="sdegree">
        {item.sdegree}
      </span>,
      <span key="worktime">（{item.v}）</span>,
    ]
    return edu.map(renderItem)
  }

  renderBrief = () => {
    const {
      data: {name, active_state: activeState = '', intention = '', tags = ''},
    } = this.props

    const briefInfoData = R.evolve(
      {
        age: v => `${v}岁`,
      },
      R.compose(
        R.pickBy(v => !R.isNil(v) && !R.isEmpty(v)),
        R.pickAll(['city', 'gender_str', 'age', 'sdegree', 'worktime'])
      )(this.props.data)
    )
    return (
      <div className={styles.baseInfoBrief}>
        <div className={styles.baseInfoBriefHeader}>
          <span>
            <h4>{name}</h4>
            <span className={styles.baseInfoBriefIdent}>{activeState}</span>
            <span className={styles.baseInfoBriefIdent}>{intention}</span>
          </span>
          <span className={styles.baseInfoBriefInfo}>
            {Object.values(briefInfoData).join(' | ')}
          </span>
        </div>
        <div>{tags && this.renderTags(tags)}</div>
      </div>
    )
  }

  renderDetail = () => {
    const {data: {exp = [], edu = []}} = this.props
    return (
      <div key="detail">
        <p className={styles.baseInfoExp}>
          <span className={styles.baseInfoExpTitle}>履历：</span>
          {this.renderExp(exp)}
        </p>
        <p>
          <span>学历：</span>
          {this.renderEdu(edu)}
        </p>
      </div>
    )
  }

  renderBaseInfo = () => {
    const {data: {avatar = ''}} = this.props
    return (
      <div className={styles.baseInfo} key="baseInfo">
        <div className={styles.baseInfoContent}>
          <img
            src={avatar}
            alt="avatar"
            className={styles.baseInfoAvatar}
            key="avatar"
          />
          {this.renderBrief()}
        </div>
        <div>{this.props.buttons}</div>
      </div>
    )
  }

  renderPosition = position => (
    <span className={styles.position}>
      沟通职位： <font className={styles.colorBlue}>{position}</font>
    </span>
  )

  render() {
    const {data, showPhone, showResume, showPosition} = this.props
    const {
      // id,
      mobile,
      resume_url: resumeUrl,
      resume_name: resumeName,
      position,
    } = data

    // const {isStar} = this.state

    // const starType = isStar ? 'star' : 'star-o'
    const hasPhone = showPhone && mobile
    const hasResume = showResume && resumeUrl
    const hasPosition = showPosition && position

    return [
      this.renderBaseInfo(),
      this.renderDetail(),
      <div key="phone">
        {hasPosition && this.renderPosition(position)}
        {hasPhone && this.renderPhone(mobile)}
        {hasResume && this.renderResume(resumeUrl, resumeName)}
      </div>,
    ]
  }
}

export default connect()(TalentBasicInfo)
