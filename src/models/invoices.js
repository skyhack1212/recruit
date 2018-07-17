import * as invoices from 'services/invoices'

export default {
  namespace: 'invoices',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
  },
  reducers: {
    setList(state, {data, count, key}) {
      return {
        ...state,
        [key]: {
          data,
          count,
        },
      }
    },
    setInvoice(state, {payload: {invoice}}) {
      return {
        ...state,
        invoice,
      }
    },
  },
  effects: {
    *fetchTodoList({payload}, {call}) {
      const data = yield call(invoices.fetchTodoList, payload)
      return data.data
    },
    *fetchAppliedList({payload}, {call}) {
      const data = yield call(invoices.fetchAppliedList, payload)
      return data.data
    },
    *fetchReviewList({payload}, {call}) {
      const data = yield call(invoices.fetchReviewList, payload)
      return data.data
    },
    *fetchCompleteList({payload}, {call}) {
      const data = yield call(invoices.fetchCompleteList, payload)
      return data.data
    },
    *fetchInvoice({payload}, {call, put}) {
      const {invoiceId} = payload
      const data = yield call(invoices.fetchInvoice, {
        invoiceId,
      })
      yield put({
        type: 'setInvoice',
        payload: {invoice: data},
      })
      return data
    },
    *createInvoice({payload}, {call}) {
      const {invoiceData, contractId} = payload
      return yield call(invoices.createInvoice, {
        invoiceData,
        contractId,
      })
    },
    *modifyInvoice({payload}, {call}) {
      const {invoiceData, contractId, invoiceId} = payload
      return yield call(invoices.modifyInvoice, {
        invoiceData,
        contractId,
        invoiceId,
      })
    },
    // 确认/拒绝/撤回 开票    formData的 "action_type": 1, //操作类型 1 通过，2拒绝，3,withdraw 撤回
    *patchInvoice({payload: {invoiceId, formData}}, {call}) {
      return yield call(invoices.patchInvoice, {invoiceId, formData})
    },
    *modifyInvoiceNumber({payload}, {call}) {
      const {data, invoiceId} = payload
      yield call(invoices.modifyInvoiceNumber, {
        data,
        invoiceId,
      })
    },
  },
}
