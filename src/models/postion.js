import * as positions from 'services/positions'

export default {
  namespace: 'positions',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetchDetail({payload}, {call}) {
      const data = yield call(positions.fetchDetail, payload)
      return data.data
    },
    *agreeConnect({payload}, {call}) {
      const data = yield call(positions.agree, payload)
      return data.data
    },
    *disAgreeConnect({payload}, {call}) {
      const data = yield call(positions.disAgree, payload)
      return data.data
    },
  },
}
