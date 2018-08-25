import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/talent/v1/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 归档
export function add(payload) {
  return request('/api/ent/talent/v1/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
