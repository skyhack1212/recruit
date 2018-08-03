import request from 'utils/request'

export function fetchDetail(query) {
  return request(`/api/ent/job/v1/get`, {
    query: {
      ...query,
      brief: 0,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function agree(body) {
  return request(`/api/ent/connect/v1/agree`, {
    method: 'GET',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function disAgree(body) {
  return request(`/api/ent/connect/v1/disagree`, {
    method: 'GET',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
