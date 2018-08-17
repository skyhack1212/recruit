import * as talents from 'services/talents'

export default {
  namespace: 'talents',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {
      data: [],
      param: {
        page: 1,
        pageSize: 20,
      },
    },
  },
  reducers: {},
  effects: {
    *fetch({payload}, {call}) {
      const data = yield call(talents.fetch, payload)
      return data.data
    },
    *archive({payload}, {call}) {
      const data = yield call(talents.archive, payload)
      return data
    },
    *modifyState({payload}, {call}) {
      const data = yield call(talents.modifyState, payload)
      return data
    },
  },
}
