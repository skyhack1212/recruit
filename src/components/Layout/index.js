import React from 'react'
import {Layout} from 'antd'
import Route from 'common/Route'

import MyHeader from './Header'
import styles from './index.less'

const {Header} = Layout

const MyLayout = () => (
  <Layout className={styles.layout}>
    <Header className={styles.header}>
      <MyHeader />
    </Header>
    <Route />
  </Layout>
)

export default MyLayout
