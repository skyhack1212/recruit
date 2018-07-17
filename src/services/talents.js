import request from 'utils/request'

export function fetch(query) {
  return request(`/api/find/v1/search`, {
    query: {
      ...query,
      uid: 37642309,
      brief: 0,
    },
  })
}

// 归档
export function archive(payload) {
  return request('/api/find/recruit/v1/archive', {
    method: 'POST',
    query: {
      uid: 37642309,
      ...payload,
    },
    body: payload,
  })
}
