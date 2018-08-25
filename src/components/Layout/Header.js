import React from 'react'
import {Menu} from 'antd'
import {withRouter, Link} from 'react-router-dom'
import logoUrl from 'images/logo.png'

import styles from './header.less'

const menuKeys = [
  '/talents/discover',
  '/talents/follow',
  '/positions',
  '/talents/pool',
]

const MyHeader = props => {
  const {location: {pathname}} = props
  const currentMenu =
    pathname === '/ent' || pathname === '/ent/'
      ? '/positions'
      : menuKeys.find(key => pathname.indexOf(key) > -1)
  const prefix = '/ent'
  return (
    <header className={styles.header}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentMenu]}
        style={{lineHeight: '64px'}}
      >
        <Menu.Item key="logo" className={styles.logoItem}>
          <Link to={`${prefix}/talents/discover`} activeclassname="active">
            <img className={styles.logoItemLogo} src={logoUrl} alt="logo" />
            <span className={styles.logoItemFont}>招聘</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/positions">
          <Link to={`${prefix}/positions`} activeclassname="active">
            职位管理
          </Link>
        </Menu.Item>
        <Menu.Item key="/talents/discover" activeclassname="active">
          <Link
            to={`${prefix}/talents/discover/search`}
            activeclassname="active"
          >
            发现人才
          </Link>
        </Menu.Item>
        <Menu.Item key="/talents/follow" activeclassname="active">
          <Link
            to={`${prefix}/talents/follow/communication`}
            activeclassname="active"
          >
            人才跟进
          </Link>
        </Menu.Item>
        <Menu.Item key="/talents/pool" activeclassname="active">
          <Link to={`${prefix}/talents/pool`} activeclassname="active">
            人才库
          </Link>
        </Menu.Item>
      </Menu>
    </header>
  )
}

export default withRouter(MyHeader)
