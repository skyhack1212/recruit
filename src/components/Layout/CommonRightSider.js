import React from 'react'
import {Icon} from 'antd'

import styles from './commonRightSider.less'

export default function(props) {
  return (
    <div>
      <div className={styles.siderHeader}>
        <Icon type="pay-circle-o" className={styles.siderHeaderIcon} />
        {/*
        <span>
          <span>0 次邀请</span>
          <span>0 次急极速沟通</span>
        </span> */}
        {/* <Button className={styles.siderHeaderRecharge} disabled>
          充值
        </Button> */}
      </div>
      <div className={styles.siderContent}>{props.children}</div>
    </div>
  )
}
