import React from 'react'
import {Button} from 'antd'

import styles from './commonRightSider.less'

export default function(props) {
  return (
    <div>
      <div className={styles.siderHeader}>
        权益余额：尚无数据
        <Button className={styles.siderHeaderRecharge} disabled>
          充值
        </Button>
      </div>
      <div className={styles.siderContent}>{props.children}</div>
    </div>
  )
}
