import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/rights/v1/staff`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 添加员工
export function add(payload) {
  return request('/api/ent/rights/v1/staff/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 解除绑定
export function del(payload) {
  return request('/api/ent/rights/v1/staff/del', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchInfoByMobile(payload) {
  return request('/api/ent/user/v1/get_by_mobile', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
