import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/find/v1/search`, {
    query: {
      ...query,
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
  return request('/api/ent/recruit/v1/batch_modify_state', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
