import request from 'utils/request'

export function fetchJobs() {
  return request('/api/ent/job/v1/namelist', {
    query: {
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addStar(payload) {
  return request('/api/ent/recruit/v1/star', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function cancelStar(payload) {
  return request('/api/ent/recruit/v1/cancel_star', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchDictionary(query) {
  return request(`/api/ent/common/v1/const`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
