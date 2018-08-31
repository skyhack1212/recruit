import React from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import {Modal, Form, InputNumber, Button} from 'antd'
import RIGHTS_TYPE_MAP from 'constants/rights'

import styles from './assignedModal.less'

@Form.create()
export default class AssignedModal extends React.PureComponent {
  static propTyes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    total: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props)
    const {item, total} = props

    this.allTypes = ['addfr', 'uh', 'exposure', 'req_resume', 'connect']

    const left = this.allTypes.reduce(
      (res, key) => ({
        ...res,
        [key]: item[`${key}_left`],
      }),
      {}
    )

    this.state = {
      // data: this.allTypes.reduce(
      //   (res, key) => ({
      //     ...res,
      //     [key]: 0,
      //   }),
      //   {}
      // ),
      left,
      total,
      leftAfterAssigned: left,
      op: props.type === 'give' ? '分配' : '回收',
    }
  }

  calValueAfterAssigned = (key, value) => {
    const {type} = this.props
    const {left} = this.state
    return type === 'give'
      ? left[key] + Number(value)
      : left[key] - Number(value)
  }

  calInputMax = key =>
    this.props.type === 'give' ? this.state.total[key] : this.state.left[key]

  formatSubmitData = data => {
    const res = Object.values(
      R.mapObjIndexed(
        (num, type) =>
          num
            ? {
                type,
                num,
              }
            : {},
        data
      )
    )
    return res
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.formatSubmitData(values))
      }
    })
  }

  handleSetValueAfterAssigned = key => value => {
    this.setState({
      leftAfterAssigned: {
        ...this.state.leftAfterAssigned,
        [key]: this.calValueAfterAssigned(
          key,
          value.target ? value.target.value : value
        ),
      },
    })
  }

  renderInput = () => {
    const {op} = this.state
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    }
    const renderItem = key => {
      const label = R.propOr(key, key, RIGHTS_TYPE_MAP)
      const max = this.calInputMax(key)
      return (
        <Form.Item key={key} label={label} {...formItemLayout}>
          {this.props.form.getFieldDecorator(key)(
            <InputNumber
              placeholder={`整数 最大可${op}${max}`}
              type="number"
              min={0}
              max={max}
              onChange={this.handleSetValueAfterAssigned(key)}
              onBlur={this.handleSetValueAfterAssigned(key)}
              precision={0}
            />
          )}
        </Form.Item>
      )
    }
    return <ul>{this.allTypes.map(renderItem)}</ul>
  }

  renderLeftValues = () => {
    const {leftAfterAssigned, op} = this.state
    return (
      <ul>
        {this.allTypes.map(key => (
          <li key={key}>
            <label htmlFor={key}>{`${op}后余额：`}</label>
            <span>{leftAfterAssigned[key]}</span>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {type, item, visible} = this.props
    const title =
      type === 'give' ? `为 ${item.name} 分配资源` : `回收 ${item.name} 的资源`
    return (
      <Modal
        title={title}
        onCancel={this.props.onCancel}
        className={styles.modal}
        visible={visible}
        width={600}
        maskClosable={false}
        footer={[
          <Button
            className={styles.button}
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
          >
            {`确定${this.state.op}权益`}
          </Button>,
        ]}
      >
        <Form className={styles.form}>
          <div className={styles.inputPanel}>{this.renderInput()}</div>
          <div className={styles.leftValuesPanel}>
            {this.renderLeftValues()}
          </div>
        </Form>
      </Modal>
    )
  }
}
