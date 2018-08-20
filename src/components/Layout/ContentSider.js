import React from 'react'
import {Layout, Button} from 'antd'
import * as R from 'ramda'

import styles from './contentSider.less'

const {Content, Sider} = Layout

const MyContent = props => {
  const getContent = () => [
    <Content key="content" className={styles.content}>
      {props.children.find(R.propEq('key', 'content'))}
    </Content>,
    <Sider key="sider" className={styles.sider} width={300}>
      <div className={styles.siderHeader}>
        权益余额：尚无数据
        <Button className={styles.siderHeaderRecharge} disabled>
          充值
        </Button>
      </div>
      <div className={styles.siderContent}>
        {props.children.find(R.propEq('key', 'sider'))}
      </div>
    </Sider>,
  ]
  return R.is(Array, props.children) ? getContent() : props.children
}

export default MyContent
