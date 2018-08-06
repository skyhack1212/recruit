/**
  传入 配置化的fields, 自动生成 表单
  form // 必填, antd生成的Form.create() 之后 生成的form 
  title: // 可选,  
  dataSource: {industry: '我是value', ...}, // 可选(修改的时候需要传), 如果指定了dataSource 则默认从dataSource 取各字段值
  fields: [  // 必填
     { 
      key: 'template', // 必选, 用于react渲染唯一标识，将作为回传数据的 key
      type: 'Select' // 必填, 定义 输入框 类型 (详情请看 /utils/getFormItem.js 映射关系)
      # Preview => 预览  
      # Input => Input
      # TextArea => Input.TextArea
      # InputNumber => InputNumber
      # RadioGroup => Radio.Group
      # CheckboxGroup => Checkbox.Group
      # Select => Select
      # DateDay => DatePicker
      # DateRange => DatePicker.RangePicker
      # OwnUploadFile => components/Common/Upload
      # OwnUploadFileView => components/Common/UploadView
      options:|| [{key: 'abc', label: '文本'}]// 可选 , 会传递给 Item组件

      render: (value, dataSource) => {}  // 可选，自定义渲染
      // 可选，自定义渲染 Item, render 将自定义整个组件，renderItem 只自定义 value 部分
      renderOnlyForItem: true or false
      
      formItemConfig: {}, // 参考 antdesign 中 Form.item 的 props
      itemConfig: {},  // 参考 antDesign 中 type 值对应组件的 props
      fieldDecoratorConfig: {}, // 参考 antdesign Form 中 getFieldDecotor 的 第二个参数的配置(initialValue 如果没有配置，默认为 dataSource[key])
     },
   ]
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Form} from 'antd'
import * as R from 'ramda'
import getFormItem from 'utils/getFormItem'

import styles from './mForm.less'

const FORM_ITEM_LAYOUT = {
  labelCol: {span: 3},
  wrapperCol: {span: 19},
}

export default class MForm extends React.PureComponent {
  static Proptype = {
    form: PropTypes.object.isRequired,
    title: PropTypes.string,
    dataSource: PropTypes.object,
    fields: PropTypes.array.isRequired,
  }

  renderField = field => {
    const {dataSource, form} = this.props
    const {getFieldDecorator} = form
    const {
      key,
      type,
      options,
      render,
      renderOnlyForItem,
      formItemConfig = {},
      fieldDecoratorConfig = {},
      itemConfig = {},
    } = field

    const initialValue =
      R.prop('initialValue', fieldDecoratorConfig) || R.prop(key, dataSource)
    const finalItemConfig = {type}

    if (!R.isEmpty(itemConfig)) {
      finalItemConfig.config = itemConfig
    }

    if (options) {
      finalItemConfig.options = options
    }

    // 如果有render 则直接render
    if (render && !renderOnlyForItem) {
      return render(initialValue, dataSource)
    }
    return (
      <Form.Item
        className={styles.inputItem}
        {...FORM_ITEM_LAYOUT}
        key={key}
        {...formItemConfig}
      >
        {/* 或者在Form.Item中render */}
        {render && renderOnlyForItem && render(initialValue, dataSource)}
        {/* 或者默认进行默认的render */}
        {!renderOnlyForItem &&
          getFieldDecorator(key, {
            initialValue,
            ...fieldDecoratorConfig,
          })(getFormItem(finalItemConfig))}
      </Form.Item>
    )
  }

  renderItems = () => {
    const {fields = []} = this.props
    return fields.map(field => {
      return (
        <React.Fragment key={field.key}>
          {this.renderField(field)}
        </React.Fragment>
      )
    })
  }

  render() {
    const {title} = this.props

    return (
      <React.Fragment>
        {title && <div className={styles.formTitle}>{title}</div>}
        {this.renderItems()}
      </React.Fragment>
    )
  }
}
