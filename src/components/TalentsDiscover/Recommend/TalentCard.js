import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import {Button} from 'antd'

import styles from './TalentCard.less'

export default class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    // onSetFit: PropTypes.func.isRequired,
    // onSetUnfit: PropTypes.func.isRequired,
  }

  handleInvite = () => {
    this.props.onInvite(this.props.data.id)
  }

  // handleSetUnfit = () => {
  //   this.props.onSetUnfit(this.props.funcdata.id)
  // }

  renderHeader = () => {
    const {data} = this.props
    const profileData = Object.values(
      R.pickAll(
        ['province', 'gender_str', 'sdegree', 'worktime', 'target'],
        data
      )
    )
    return (
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <img alt="avatar" className={styles.avatar} src={data.avatar} />
          <div>
            <p className={styles.headerInfoName}>{data.name}</p>
            <p>{profileData.join(`     |    `)}</p>
          </div>
        </div>
        <div>
          <Button
            className={styles.headerPrimaryButton}
            onClick={this.handleInvite}
            disabled={data.is_archive}
            type="primary"
          >
            职位邀请
          </Button>
          {/*
          <button
            className={styles.headerCommonButton}
            onClick={this.handleSetUnFit}
          /> */}
        </div>
      </div>
    )
  }

  renderTags = () => {
    const {tags = ''} = this.props.data
    const tagList = tags.split(',')
    return (
      <ul className={`${styles.tags} ${styles.marginT20}`}>
        {tagList.map(tag => <li key={tag}>{tag}</li>)}
      </ul>
    )
  }

  renderWorkExp = () => {
    const {exp = []} = this.props.data
    const item = values => (
      <div className={styles.marginT20}>
        <p className={styles.itemTitle}>
          <span className={`${styles.colorBlue} ${styles.marginR10}`}>
            {values.company}
          </span>
          <span className={styles.marginR10}>{values.position}</span>
          <span className={styles.marginR10}>{values.v}</span>
        </p>
        <p>{values.description}</p>
      </div>
    )
    return exp.map(item)
  }

  renderEdu = () => {
    const {edu = []} = this.props.data
    const item = values => (
      <div className={styles.marginT20}>
        <p className={styles.itemTitle}>
          <span className={`${styles.colorGreen} ${styles.marginR10}`}>
            {values.school}
          </span>
          <span className={styles.marginR10}>{values.sdegree}</span>
          <span className={styles.marginR10}>{values.department}</span>
          <span className={styles.marginR10}>{values.v}</span>
        </p>
        <p>{values.description}</p>
      </div>
    )
    return edu.map(item)
  }

  render() {
    return (
      <div className={styles.card}>
        {this.renderHeader()}
        {this.renderTags()}
        {this.renderWorkExp()}
        {this.renderEdu()}
      </div>
    )
  }
}
