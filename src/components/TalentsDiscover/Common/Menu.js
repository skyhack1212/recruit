import React from 'react'
import {Menu, Icon} from 'antd'
import {Link} from 'react-router-dom'

export default function(props) {
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <Menu.Item key="search">
        <Link to="/ent/talents/discover/search">
          <Icon type="search" />搜索人才
        </Link>
      </Menu.Item>
      <Menu.Item key="recommend">
        <Link to="/ent/talents/discover/recommend">
          <Icon type="like" />人才推荐
        </Link>
      </Menu.Item>
      <Menu.Item key="applicant">
        <Link to="/ent/talents/discover/applicant">
          <Icon type="heart-o" />主动投递
        </Link>
      </Menu.Item>
    </Menu>
  )
}
