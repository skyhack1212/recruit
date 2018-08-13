import * as recommends from 'services/recommends'

export default {
  namespace: 'recommends',
  state: {
    invoice: {},
    list: {
      query: {},
      data: [],
    },
  },
  reducers: {},
  effects: {
    *fetch({payload}, {call}) {
      const data = yield call(recommends.fetch, payload)
      return data.data
    },
  },
}
