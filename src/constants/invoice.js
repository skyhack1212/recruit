import * as R from 'ramda'

export const INVOICE_AUTH_MAP = {
  media: {
    allowedUrl: [
      '/crm-v2/invoice/todo',
      '/crm-v2/invoice/applied',
      '/crm-v2/invoice/complete',
      '/crm-v2/invoice/create',
      '/crm-v2/invoice/:invoiceId/modify',
      '/crm-v2/invoice/:invoiceId/detail',
    ],
    defaultUrl: '/crm-v2/invoice/todo',
  },
  finance: {
    allowedUrl: [
      '/crm-v2/invoice/review',
      '/crm-v2/invoice/complete',
      '/crm-v2/invoice/:invoiceId/detail',
      '/crm-v2/invoice/:invoiceId/confirm',
    ],
    defaultUrl: '/crm-v2/invoice/review',
  },
  admin: {
    allowedUrl: [
      '/crm-v2/invoice/todo',
      '/crm-v2/invoice/applied',
      '/crm-v2/invoice/complete',
      '/crm-v2/invoice/create',
      '/crm-v2/invoice/:invoiceId/modify',
      '/crm-v2/invoice/:invoiceId/detail',
      '/crm-v2/invoice/review',
      '/crm-v2/invoice/complete',
      '/crm-v2/invoice/:invoiceId/detail',
      '/crm-v2/invoice/:invoiceId/confirm',
    ],
    defaultUrl: '/crm-v2/invoice/todo',
  },
}

export const INVOICE_UPLOAD_FILE_MAP = {
  qualification_file: {
    label: '资质证明',
    isRequired: false,
  },
  account_permit_file: {
    label: '开户证明',
    isRequired: true,
  },
  license_file: {
    label: '营业执照',
    isRequired: false,
  },
  tax_certificate_file: {
    label: '税务登记证',
    isRequired: false,
  },
}

export const INVOICE_STATUS_MAP = {
  0: '新建',
  1: '待确认',
  2: '确认开票',
  3: '待开发票(被驳回)',
  4: '作废', // （不展示该状态）
}

export const APPLIED_INVOICE_STATUS = R.pickAll([0, 1, 3], INVOICE_STATUS_MAP)

export const EDITABLE_INVOICE_STATUS = R.pickAll([0, 3], INVOICE_STATUS_MAP)

export const INVOICE_ACTION_TYPE = {
  1: 'pass',
  2: 'reject',
  3: 'withdraw',
}

export const INVOICE_SUBMIT_ACTION_TYPE = {
  0: '保存',
  1: '提交',
}

export const INVOICE_LABEL_MAP = {
  contract_number: '合同编号',
  invoice_title: '发票抬头',
  tax_number: '税号',
  bank: '开户行',
  bank_account: '开户账户',
  address: '联系地址',
  invoice_content: '发票类型',
  expense_type: '发票内容',
  phone: '联系电话',
  price_details: '订单编号',
  media_remark: '申请开票备注',
}

export const FORM_ITEM_LAYOUT = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
}

export const PAGE_SIZE = 30
