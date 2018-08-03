import React from 'react'
import {Link} from 'react-router-dom'
import {Icon} from 'antd'

import styles from './logo.less'

const Logo = () => {
  const title = 'CRM'
  return (
    <div className={styles.logo}>
      <Link to="/">
        <Icon type="zhihu-icon" className={styles.icon} />
        <h5 className={styles.title}>{title}</h5>
      </Link>
    </div>
  )
}

export default Logo
