import * as global from 'services/global'
import * as R from 'ramda'

export default {
  namespace: 'global',

  state: {
    jobs: [],
    dictionary: {},
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
  },

  subscriptions: {
    setup({history, dispatch}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }

        R.once(() => {
          dispatch({
            type: 'fetchDictionary',
            payload: {},
          })
        })()
      })
    },
  },
}
