import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/find/v1/search`, {
    query: {
      ...query,
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
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 修改状态
export function modifyState(payload) {
  return request('/api/ent/recruit/v1/modify_state', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
