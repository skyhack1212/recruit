import fetchJobs from 'services/global'

export default {
  namespace: 'global',

  state: {
    dictionary: {},
    contentContainer: '',
  },

  effects: {
    *fetchJos(action, {call}) {
      const {data} = yield call(fetchJobs, {})
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
