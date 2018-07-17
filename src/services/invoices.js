import request from 'utils/request'
import * as R from 'ramda'

export function fetchTodoList(query) {
  return request(`/api/crm/v1/invoice/todo/media`, {
    query,
  })
}

export function fetchAppliedList(query) {
  return request(`/api/crm/v1/invoice/done/media`, {
    query,
  })
}

export function fetchReviewList(query) {
  return request(`/api/crm/v1/invoice/todo/finance`, {
    query,
  })
}

export function fetchCompleteList(query) {
  return request(`/api/crm/v1/invoice/done`, {
    query,
  })
}

// 获取发票详情
export async function fetchInvoice({invoiceId}) {
  const res = await request(`/api/crm/v1/invoice/${invoiceId}`)
  return R.path(['data'])(res)
}

// 新建发票
export async function createInvoice({invoiceData, contractId}) {
  const res = await request(`/api/crm/v1/contract/${contractId}/invoice`, {
    body: invoiceData,
    method: 'POST',
  })
  return R.path(['data'])(res)
}

// 编辑发票
export async function modifyInvoice({invoiceData, contractId, invoiceId}) {
  const res = await request(
    `/api/crm/v1/contract/${contractId}/invoice/${invoiceId}`,
    {
      body: invoiceData,
      method: 'PUT',
    }
  )
  return R.path(['data'])(res)
}

// 修改发票部分字段
export async function patchInvoice({formData, invoiceId}) {
  const res = await request(`/api/crm/v1/invoice/${invoiceId}`, {
    body: formData,
    method: 'PATCH',
  })
  return R.path(['data'])(res)
}

// 批量获取订单详情:
// orderId 是个 字符串 以逗号分隔, 是order的id
export async function fetchInvoiceOrders({orderId}) {
  const res = await request(`/api/crm/v1/invoice/orders`, {
    method: 'GET',
    query: {id: orderId},
  })
  return R.path(['data'])(res)
}

export async function modifyInvoiceNumber({data, invoiceId}) {
  const res = await request(`/api/crm/v1/invoice/${invoiceId}/numbers`, {
    method: 'PUT',
    body: data,
  })
  return R.path(['data'])(res)
}
