import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/recruit/v1/recommend`, {
    query: {
      ...query,
      brief: 0,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function setUnfit(query) {
  return request(`/api/ent/recruit/v1/recommend`, {
    query: {
      ...query,
      brief: 0,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
