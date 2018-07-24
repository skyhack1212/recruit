import * as global from 'services/global'

export default {
  namespace: 'global',

  state: {
    jobs: [],
  },

  effects: {
    *fetchJos(action, {call, put}) {
      const {data} = yield call(global.fetchJobs, {})
      yield put({
        type: 'setJobs',
        payload: data,
      })
      return data
    },
    *addStar({payload}, {call}) {
      const {data} = yield call(global.addStar, payload)
      return data
    },
    *cancelStar({payload}, {call}) {
      const {data} = yield call(global.cancelStar, payload)
      return data
    },
  },

  reducers: {
    setJobs(state, {payload: {jobs = []}}) {
      return {
        ...state,
        jobs,
      }
    },
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }
      })
    },
  },
}
