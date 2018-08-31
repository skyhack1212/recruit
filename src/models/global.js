import * as global from 'services/global'

export default {
  namespace: 'global',

  state: {
    jobs: [],
    dictionary: {},
    currentUser: {},
  },

  effects: {
    *fetchJobs(action, {call, put}) {
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
    *fetchDictionary({payload}, {call, put}) {
      const {data} = yield call(global.fetchDictionary, payload)
      yield put({
        type: 'setDictionary',
        payload: data,
      })
      return data
    },
    *fetchCurrentUser(payload, {call, put}) {
      const {data} = yield call(global.fetchUser, {})
      yield put({
        type: 'setUser',
        payload: data,
      })
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
    setDictionary: (state, {payload}) => {
      return {
        ...state,
        dictionary: payload,
      }
    },
    setUser(state, {payload}) {
      return {
        ...state,
        currentUser: payload,
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

        // R.once(() => {
        //   dispatch({
        //     type: 'fetchDictionary',
        //     payload: {},
        //   })
        // })()

        // R.once(() => {
        //   dispatch({
        //     type: 'fetchDictionary',
        //     payload: {},
        //   })
        // })()
      })
    },
  },
}
