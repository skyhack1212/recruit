/* 
  @file: 内容部分，菜单 - 内容 - 侧边栏 布局
*/
import React from 'react'
import {Layout} from 'antd'
import * as R from 'ramda'

import styles from './menuContentSider.less'

const {Content, Sider} = Layout

const MyContent = props => {
  const getContent = () => (
    <div className={styles.main}>
      <Sider key="menu" className={styles.menu} width={200}>
        {props.children.find(R.propEq('key', 'menu')) || null}
      </Sider>
      <Content key="content" className={styles.content}>
        {props.children.find(R.propEq('key', 'content')) || null}
      </Content>
      <Sider key="sider" className={styles.sider} width={350}>
        {props.children.find(R.propEq('key', 'sider')) || null}
      </Sider>
    </div>
  )
  return R.is(Array, props.children) ? getContent() : props.children
}

export default MyContent
