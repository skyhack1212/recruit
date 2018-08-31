import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

export default function(props) {
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <Menu.Item key="staff">
        <Link to="/ent/account/staff">
          <Icon type="contacts" />员工管理
        </Link>
      </Menu.Item>
      <Menu.Item key="rights">
        <Link to="/ent/account/rights">
          <Icon type="form" />权益管理
        </Link>
      </Menu.Item>
    </Menu>
  )
}
