import * as resumes from 'services/resumes'

export default {
  namespace: 'resumes',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({payload}, {call}) {
      const data = yield call(resumes.fetch, payload)
      return data.data
    },
    *sendMessage({payload}, {call}) {
      const data = yield call(resumes.sendMessage, payload)
      return data.data
    },
    *batchSendMessage({payload}, {call}) {
      const data = yield call(resumes.batchSendMessage, payload)
      return data.data
    },
    *complete({payload}, {call}) {
      const data = yield call(resumes.complete, payload)
      return data.data
    },
    *elimination({payload}, {call}) {
      const data = yield call(resumes.elimination, payload)
      return data.data
    },
  },
}
