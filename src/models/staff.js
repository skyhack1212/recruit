import * as staff from 'services/staff'

export default {
  namespace: 'staff',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({payload}, {call}) {
      const data = yield call(staff.fetch, payload)
      return data.data
    },
    *add({payload}, {call}) {
      const data = yield call(staff.add, payload)
      return data.data
    },
    *del({payload}, {call}) {
      const data = yield call(staff.del, payload)
      return data.data
    },
    *fetchInfoByMobile({payload}, {call}) {
      const data = yield call(staff.fetchInfoByMobile, payload)
      return data.data
    },
  },
}
