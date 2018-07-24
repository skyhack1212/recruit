import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/find/v1/search`, {
    query: {
      ...query,
      uid: 37642309,
      brief: 0,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 归档
export function archive(payload) {
  return request('/api/ent/recruit/v1/archive', {
    method: 'POST',
    query: {
      uid: 37642309,
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}
