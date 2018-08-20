import fetch from 'dva/fetch'
import queryString from 'query-string'
import urlParse from 'url'
import * as R from 'ramda'
import {isEmpty} from 'utils'

import {SIGN_IN_URL} from 'constants'
import {GUID} from './index'

const isJson = response => {
  if (response.status === 204) {
    return false
  }

  if (response.headers.get('content-length') === '0') {
    return false
  }

  const type = response.headers.get('content-type')
  return type && type.indexOf('application/json') !== -1
}

const isSuccess = ({status}) => status >= 200 && status < 300

const getMessage = data =>
  R.path(['msg'], data) || R.path(['error'], data) || data

/* eslint-disable */
const parseError = async (status, data) => {
  const msg = getMessage(data)
  if (status >= 500) {
    throw new Error(msg || '服务器错误')
  } else if (status === 404) {
    if (data.redirectUrl) {
      window.location = data.redirectUrl
    } else {
      throw new Error('没有找到对应接口')
    }
  } else if (status === 401 || status === 403) {
    const currentUrl = window.location.href
    window.location = `${SIGN_IN_URL}?to=${currentUrl}`
  } else if (status >= 400 && status < 500) {
    throw data
  } else if (status >= 300) {
    throw new Error(msg || '未知错误')
  } else if (status === 200) {
    if (status.code !== undefined && status.code !== 0) {
      throw new Error(msg || '未知错误')
    }
  }
  return data
}
/* eslint-disable */

const parseUrl = (url, options) => {
  if (typeof options.query === 'object') {
    const urlObj = urlParse.parse(url, true)
    const query = queryString.stringify({
      ...urlObj.query,
      ...options.query,
    })
    if (!isEmpty(urlObj.hostname)) {
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}?${query}`
    }
    return `${urlObj.pathname}?${query}`
  }
  return url
}

const fillOptions = ({body, ...options}) => {
  const newOptions = {
    ...options,
    mode: 'cors',
    credentials: 'include',
    headers: {
      accept: 'application/json, text/plain, */*',
      'X-Request-Id': GUID(),
    },
  }
  if (body && !(body instanceof FormData)) {
    return {
      ...newOptions,
      body: JSON.stringify(body),
      headers: {
        ...newOptions.headers,
        'Content-Type': 'application/json',
      },
    }
  } else if (body instanceof FormData) {
    return {
      ...newOptions,
      body,
    }
  }

  return newOptions
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * options.body {object} 可选
 * options.query {object} 可选, 会和url里面的 ?search进行合并
 * options.method {string} 必选  为大写的字符串
 * [...以及其他一些可选的字段 会拼到fetch方法的参数里面]
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = {}) {
  // 添加默认options
  const newOptions = fillOptions(options)

  // 处理query参数
  const newUrl = parseUrl(url, options)

  const response = await fetch(newUrl, newOptions)

  const data = isJson(response) ? await response.json() : await response.text()

  const ret = {
    data: isSuccess(response) ? data : await parseError(response.status, data),
    headers: response.headers,
  }

  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count')
  }
  return ret
}
