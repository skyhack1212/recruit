import * as rights from 'services/rights'

export default {
  namespace: 'rights',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({payload}, {call}) {
      const data = yield call(rights.fetch, payload)
      return data.data
    },
    *give({payload}, {call}) {
      const data = yield call(rights.give, payload)
      return data.data
    },
    *take({payload}, {call}) {
      const data = yield call(rights.take, payload)
      return data.data
    },
  },
}
