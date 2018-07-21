import * as global from 'services/global'

export default {
  namespace: 'global',

  state: {
    dictionary: {},
    contentContainer: '',
  },

  effects: {
    *fetchJos(action, {call}) {
      const {data} = yield call(global.fetchJobs, {})
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

  reducers: {},

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
