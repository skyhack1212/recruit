import request from 'utils/request'

// 获取权益信息
export function fetch(query) {
  return request(`/api/ent/rights/v1/info`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 回收权益
export function take(payload) {
  return request('/api/ent/rights/v1/staff/take', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 分配权益
export function give(payload) {
  return request('/api/ent/rights/v1/staff/give', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}
