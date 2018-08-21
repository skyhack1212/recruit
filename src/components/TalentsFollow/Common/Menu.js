import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

export default function(props) {
  return (
    <Menu
      style={{width: 200}}
      defaultSelectedKeys={[props.activeMenu]}
      mode="inline"
    >
      <Menu.Item key="communication">
        <Link to="/ent/talents/follow/communication">
          <Icon type="message" />沟通中
        </Link>
      </Menu.Item>
      <Menu.Item key="interview">
        <Link to="/ent/talents/follow/interview">
          <Icon type="inbox" />待约面
        </Link>
      </Menu.Item>
    </Menu>
  )
}
