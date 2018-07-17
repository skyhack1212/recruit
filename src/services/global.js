import request from 'utils/request'

export default function fetchJobs() {
  return request('/api/job/v1/namelist', {
    query: {uid: 37642309},
  })
}
