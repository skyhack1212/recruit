import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

export default function(props) {
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <Menu.Item key="list">
        <Link to="/ent/talents/pool">
          <Icon type="message" />人才库管理
        </Link>
      </Menu.Item>
    </Menu>
  )
}
