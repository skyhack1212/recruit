/* eslint-disable max-statements */

import moment from 'moment'
import * as R from 'ramda'
import React from 'react'

window.MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function getTimeDistance(type) {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - day * oneDay

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      ),
    ]
  }

  // Default type === 'year'
  const year = now.getFullYear()
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
}

export function getPath(path) {
  return path.charCodeAt(0) === '/' ? path : `/${path}`
}

export function digitUppercase(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  let num = Math.abs(n)
  let s = ''
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      ''
    )
  })
  s = s || '整'
  num = Math.floor(num)
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = ''
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p
      num = Math.floor(num / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}

export function formatTimestamp(stamp, format) {
  return moment.unix(stamp).format(format)
}

export function trimObjValue(obj = {}) {
  if (!R.is(Object, obj)) {
    return {}
  }
  const trimValue = val => (R.isNil(val) ? val : R.trim(val.toString()))
  return R.mapObjIndexed(trimValue)(obj)
}

export const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)

export const GUID = () =>
  `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`

export const getInterfaceErrorContent = (errors = []) => {
  const keyStyle = {marginRight: 10}
  return (
    <div>
      {errors.map(el => {
        return (
          <div key={el.key}>
            <span style={keyStyle}>出错字段:{el.key}</span>
            <span>{el.message}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * 传入类似以下的数据,得到一个json，json用于antd的setFields方法
 *
 * [
  {
    key: 'phone',
    msg: '电话有误',
  },
  {
    key: 'price_details',
    id: 1231, //订单id
    msg: '表单金额不对',
  },
  {
    key: 'price_details',
    id: 1232, //订单id
    msg: '表单金额不对',
  },
]
 * @return   {Object}
 */
export const formatFormErrors = (errors = [], formData) => {
  if (R.isEmpty(errors)) {
    return {}
  }

  const special = {
    price_details: item => {
      if (!item.id) {
        return {}
      }
      const key = `price-${item.id}`
      return {
        [key]: {
          value: formData[key],
          errors: [new Error(item.msg || item.message || '')],
        },
      }
    },
  }

  const fieldsAndErrors = errors.reduce((obj, item) => {
    const {key} = item
    const func = special[key]
    if (func) {
      return {
        ...obj,
        ...func(item),
      }
    }

    return {
      ...obj,
      [key]: {
        value: formData[key],
        errors: [new Error(item.msg || item.message || '')],
      },
    }
  }, {})

  return fieldsAndErrors
}

export const downloadFile = url => {
  window.open(url)
}

// 根据后缀名判断是否是图片
export const isImage = name =>
  /\.(png|jpg|jpeg|gif|webp|svg)/.test(name) || /^data:image\//.test(name)
