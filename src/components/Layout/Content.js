import React from 'react'

import {Layout} from 'antd'

import styles from './content.less'

const {Content} = Layout

const MyContent = props => {
  return (
    <Content className={styles.contentMain}>
      {props.content || props.children}
    </Content>
  )
}

export default MyContent
