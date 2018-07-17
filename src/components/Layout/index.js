import React from 'react'
import {Layout} from 'antd'

import MyHeader from './Header'
import MyContent from './Content'
import styles from './index.less'

const {Header, Content} = Layout

const MyLayout = () => (
  <Layout className={styles.layout}>
    <Header className={styles.header}>
      <MyHeader />
    </Header>
    <Content className={styles.content} id="content">
      <MyContent />
    </Content>
    {/* <Footer>Footer</Footer> */}
  </Layout>
)

export default MyLayout
