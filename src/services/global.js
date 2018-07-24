import request from 'utils/request'

export function fetchJobs() {
  return request('/api/ent/job/v1/namelist', {
    query: {
      uid: 37642309,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addStar(payload) {
  return request('/api/ent/recruit/v1/star', {
    query: {
      uid: 37642309,
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function cancelStar(payload) {
  return request('/api/ent/recruit/v1/cancel_star', {
    query: {
      uid: 37642309,
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}
