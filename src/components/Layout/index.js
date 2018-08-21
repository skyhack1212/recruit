import React from 'react'
import {Layout} from 'antd'
import Route from 'common/Route'

import MyHeader from './Header'
import styles from './index.less'

const {Header, Content} = Layout

const MyLayout = () => (
  <Layout className={styles.layout}>
    <Header className={styles.header}>
      <MyHeader />
    </Header>
    <Content className={styles.content}>
      <Route />
    </Content>
  </Layout>
)

export default MyLayout
