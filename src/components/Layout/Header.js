import React from 'react'
import {Menu} from 'antd'
import {withRouter, Link} from 'react-router-dom'
import * as R from 'ramda'
import logoUrl from 'images/logo.png'

import styles from './header.less'

const MyHeader = props => {
  const {location: {pathname}} = props
  const path = pathname.split('/')
  const currentMenu =
    path.length > 1 && path[1] === 'ent'
      ? R.propOr('talents', '2', path) || 'talents'
      : R.propOr('talents', '1', path) || 'talents'
  const prefix = path.length > 1 && path[1] === 'ent' ? '/ent' : ''
  return (
    <header className={styles.header}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[currentMenu]}
        style={{lineHeight: '64px'}}
      >
        <Menu.Item key="logo">
          <Link to={`${prefix}/talents`} activeclassname="active">
            <img className={styles.logo} src={logoUrl} alt="logo" />
          </Link>
        </Menu.Item>
        <Menu.Item key="positions">
          <Link to={`${prefix}/positions`} activeclassname="active">
            职位管理
          </Link>
        </Menu.Item>
        <Menu.Item key="talents">
          <Link to={`${prefix}/talents`} activeclassname="active">
            人才搜索
          </Link>
        </Menu.Item>
        <Menu.Item key="recommends">
          <Link to={`${prefix}/recommends`} activeclassname="active">
            人才推荐
          </Link>
        </Menu.Item>
        <Menu.Item key="resumes">
          <Link to={`${prefix}/resumes`} activeclassname="active">
            简历筛选
          </Link>
        </Menu.Item>
      </Menu>
    </header>
  )
}

export default withRouter(MyHeader)
