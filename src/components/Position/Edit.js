import React from 'react'
import {connect} from 'dva'
import PropTypes from 'prop-types'
import {Form, Button, message} from 'antd'
import {EMAIL_SUFFIX} from 'constants'
import {
  WORKTIME_OPTIONS,
  DEGREE_OPTIONS,
  SALARY_OPTIONS,
} from 'constants/position'
import {isEmpty} from 'utils'
import * as R from 'ramda'
import MForm from 'components/Common/MForm'
import LocationInput from 'components/Position/LocationInput'
import SalaryInput from 'components/Position/SalaryInput'
import ProfessionInput from 'components/Position/ProfessionInput'

import styles from './edit.less'

@connect(state => ({
  loading: state.loading.models.positions,
  dictionary: state.global.dictionary,
}))
@Form.create()
export default class PositionList extends React.Component {
  static Proptype = {
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dictionary: {},
  }

  state = {
    emailSource: [],
    currentMajor: '',
    currentProfession: '',
    formatData: {},
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      formatData: this.getFormatData(newProps.data),
    })
  }

  getRequiredRule = msg => ({
    required: true,
    message: msg,
  })

  getBaseFields = () => {
    const {data} = this.props
    return [
      {
        key: 'company',
        type: 'Preview',
        formItemConfig: {
          label: '公司名称',
        },
        fieldDecoratorConfig: {
          initialValue: data.company,
          rules: [this.getRequiredRule('职位名称不能为空')],
        },
        itemConfig: {
          value: data.company,
        },
      },
      {
        key: 'position',
        type: 'Input',
        formItemConfig: {
          label: '职位名称',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('职位名称不能为空')],
        },
        itemConfig: {
          placeholder: '请输入职位名称',
        },
      },
      {
        key: 'province',
        type: 'Select',
        formItemConfig: {
          label: '工作地点',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('工作地点不能为空')],
        },
        itemConfig: {
          placeholder: '请输入工作地点',
        },
        render: this.renderLocation,
        renderOnlyForItem: true,
      },
      {
        key: 'address',
        type: 'Input',
        formItemConfig: {
          label: '办公地点',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('办公地点不能为空')],
        },
        itemConfig: {
          placeholder: '请输入办公地点',
        },
      },
      {
        key: 'email',
        type: 'AutoComplete',
        formItemConfig: {
          label: '常用邮箱',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('邮箱不能为空')],
          onChange: this.handleEmailChange,
        },
        itemConfig: {
          placeholder: '请输入邮箱',
          dataSource: this.state.emailSource,
        },
      },
    ]
  }

  getPositionFileds = () => {
    return [
      {
        key: 'profession',
        type: 'Input',
        formItemConfig: {
          label: '职位方向',
        },
        render: this.renderProfession,
        renderOnlyForItem: true,
      },
      {
        key: 'stags',
        type: 'Select',
        options: this.getStagsOptions(),
        formItemConfig: {
          label: '技能要求',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('技能要求不能为空')],
        },
        itemConfig: {
          mode: 'tags',
          placeholder: '请输入技能要求',
        },
      },
      {
        key: 'worktime',
        type: 'Select',
        options: WORKTIME_OPTIONS,
        formItemConfig: {
          label: '工作经验',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('工作经验不能为空')],
        },
        itemConfig: {
          placeholder: '请选择工作经验要求',
        },
      },
      {
        key: 'degree',
        type: 'Select',
        options: DEGREE_OPTIONS,
        formItemConfig: {
          label: '学历要求',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('学历要求不能为空')],
        },
        itemConfig: {
          placeholder: '请选择学历要求',
        },
      },
      {
        key: 'salary',
        type: 'Select',
        options: SALARY_OPTIONS,
        formItemConfig: {
          label: '薪酬范围',
        },
        render: this.renderSalary,
        renderOnlyForItem: true,
      },
      {
        key: 'description',
        type: 'TextArea',
        formItemConfig: {
          label: '职位描述',
        },
        fieldDecoratorConfig: {
          rules: [this.getRequiredRule('职位描述不能为空')],
        },
        itemConfig: {
          className: styles.description,
        },
      },
      {
        key: 'custom_text',
        type: 'Input',
        formItemConfig: {
          label: '职位卖点',
        },
      },
    ]
  }

  getStagsOptions = () => {
    const {pfmj = []} = this.props.dictionary
    const {currentMajor, currentProfession} = this.state
    if (currentMajor === '' || currentProfession === '') {
      return []
    }
    const majors = R.propOr(
      [],
      'majors',
      R.find(R.propEq('id', currentProfession), pfmj)
    )
    const stags = R.propOr(
      [],
      'stags',
      R.find(R.propEq('id', currentMajor), majors)
    )
    const tags = stags.reduce((result, item) => [...result, ...item.tags], [])
    return tags.map(item => ({
      label: item,
      key: item,
    }))
  }

  getFormatData = data => {
    const transformations = {
      stags: R.split(','),
      salary_min: value => (isEmpty(value) ? '' : parseFloat(value)),
      salary_max: value => (isEmpty(value) ? '' : parseFloat(value)),
    }
    return R.evolve(transformations, data)
  }

  formatSubmitData = values => {
    const plainFileds = ['location', 'profession', 'salary']
    const plainValues = R.compose(R.mergeAll, R.values, R.pickAll(plainFileds))(
      values
    )
    const transformations = {
      stags: R.join(','),
      salary_min: v => `${v}K`,
      salary_max: v => `${v}K`,
    }
    return R.evolve(transformations, {
      ...R.omit(plainFileds, values),
      ...plainValues,
    })
  }

  checkProfession = (rule, {profession, major}, callback) => {
    if (isEmpty(profession)) {
      callback('方向不能为空')
      return
    }
    if (isEmpty(major)) {
      callback('职位不能为空')
      return
    }
    callback()
  }

  checkLocation = (rule, {province, city}, callback) => {
    if (isEmpty(province)) {
      callback('省份不能为空')
      return
    }
    if (isEmpty(city)) {
      callback('城市不能为空')
      return
    }
    callback()
  }

  checkSalary = (rule, {salary_min: min, salary_max: max}, callback) => {
    if (isEmpty(min)) {
      callback('薪酬下限值不能为空')
      return
    }
    if (!isEmpty(max) && Number(min) > Number(max)) {
      callback('薪酬下限值不能大于薪酬上限值')
      return
    }
    callback()
  }

  handleEmailChange = value =>
    this.setState({
      emailSource:
        !value || R.contains('@', value)
          ? []
          : EMAIL_SUFFIX.map(item => `${value}${item}`),
    })

  handleMajorChange = ({profession, major = ''}) =>
    this.setState({
      currentMajor: major,
      currentProfession: profession,
    })

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('请修改表单错误字段')
        return
      }
      if (this.props.onSubmit) {
        this.props.onSubmit(this.formatSubmitData(values))
      }
    })
  }

  renderLocation = () => {
    const {getFieldDecorator} = this.props.form
    const {formatData} = this.state
    return getFieldDecorator('location', {
      initialValue: {
        province: formatData.province,
        city: formatData.city,
      },
      rules: [
        this.getRequiredRule('工作地点不能为空'),
        {validator: this.checkLocation},
      ],
    })(<LocationInput dictionary={this.props.dictionary} />)
  }

  renderProfession = () => {
    const {getFieldDecorator} = this.props.form
    const {formatData} = this.state
    return getFieldDecorator('profession', {
      initialValue: {
        profession: formatData.profession,
        major: formatData.major,
      },
      onChange: this.handleMajorChange,
      rules: [
        this.getRequiredRule('职位方向不能为空'),
        {validator: this.checkProfession},
      ],
    })(<ProfessionInput dictionary={this.props.dictionary} />)
  }

  renderSalary = () => {
    const {formatData} = this.state
    return this.props.form.getFieldDecorator('salary', {
      initialValue: {
        salary_min: formatData.salary_min,
        salary_max: formatData.salary_max,
      },
      onChange: this.handleMajorChange,
      rules: [
        this.getRequiredRule('薪酬信息不能为空'),
        {validator: this.checkSalary},
      ],
    })(<SalaryInput />)
  }

  render() {
    const {form} = this.props
    const {formatData} = this.state
    return (
      <div className={styles.main}>
        <header className={styles.header}>发布职位</header>
        <MForm
          form={form}
          dataSource={formatData}
          fields={this.getBaseFields()}
          title="基本信息"
        />
        <MForm
          form={form}
          dataSource={formatData}
          fields={this.getPositionFileds()}
          title="职位要求"
        />
        <div>
          <Button onClick={this.handleSubmit} className={styles.submitButton}>
            发布职位
          </Button>
        </div>
      </div>
    )
  }
}
