import * as talentPool from 'services/talentPool'

export default {
  namespace: 'talentPool',
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
      const data = yield call(talentPool.fetch, payload)
      return data.data
    },
    *add({payload}, {call}) {
      const data = yield call(talentPool.add, payload)
      return data
    },
  },
}
