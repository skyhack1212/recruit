import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

export default function(props) {
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <Menu.Item key="list">
        <Link to="/ent/positions">
          <Icon type="contacts" />职位列表
        </Link>
      </Menu.Item>
      <Menu.Item key="create">
        <Link to="/ent/positions/create">
          <Icon type="form" />新建职位
        </Link>
      </Menu.Item>
    </Menu>
  )
}
