import React from 'react'
import {Icon} from 'antd'

import styles from './overview.less'

export default function(props) {
  const renderCard = item => (
    <div className={styles.card} key={item.title}>
      <p className={styles.title}>{item.title}</p>
      {props.loading ? (
        <Icon type="loading-3-quarters" />
      ) : (
        <p className={styles.value}>{item.value}</p>
      )}
    </div>
  )
  return <div className={styles.main}>{props.data.map(renderCard)}</div>
}
