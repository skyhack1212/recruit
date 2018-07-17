import React from 'react'
import {Menu} from 'antd'
import {withRouter, Link} from 'react-router-dom'
import * as R from 'ramda'
import logoUrl from 'images/logo.png'

import styles from './header.less'

const MyHeader = props => {
  const {location: {pathname}} = props
  const currentMenu = R.propOr('talents', '1', pathname.split('/')) || 'talents'
  return (
    <header className={styles.header}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentMenu]}
        style={{lineHeight: '64px'}}
      >
        <Menu.Item key="logo">
          <Link to="/talents" activeclassname="active">
            <img className={styles.logo} src={logoUrl} alt="logo" />
          </Link>
        </Menu.Item>
        <Menu.Item key="talents">
          <Link to="/talents" activeclassname="active">
            搜索人才
          </Link>
        </Menu.Item>
        <Menu.Item key="resumes">
          <Link to="/resumes" activeclassname="active">
            简历筛选
          </Link>
        </Menu.Item>
      </Menu>
    </header>
  )
}

export default withRouter(MyHeader)
