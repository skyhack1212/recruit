import React from 'react'
import {connect} from 'dva'
import {Table, Popover} from 'antd'
import * as R from 'ramda'
import {Link} from 'react-router-dom'

import {unixToStr, isValidUnix, dateTimeFormat} from 'utils/date'
import {localeString} from 'utils/number'
import {
  CONTRACT_STATUS_MAP,
  CONTRACT_INVOICE_STATUS_MAP,
} from 'constants/contract'

import {INVOICE_STATUS_MAP} from 'constants/invoice'

import styles from './ListTable.less'

const renderNoBreakSpan = value => (
  <span className={styles.noBreak}>{value}</span>
)

const renderDateRange = (start, end) =>
  isValidUnix(start) && isValidUnix(end)
    ? `${unixToStr(start)} ~ ${unixToStr(end)}`
    : ''

const getDateTime = value =>
  isValidUnix(value) ? unixToStr(value, dateTimeFormat) : ''

const renderCompany = value => (
  <Popover placement="bottomLeft" content={value} trigger="hover">
    <span key="text" className={`${styles.ellipsis} ${styles.company}`}>
      {value}
    </span>
  </Popover>
)

const getFields = ({dictionary}) => {
  const {
    expense_type: expenseType = {},
    self_company: selfCompany = {},
  } = dictionary

  const allFields = {
    contractNumber: {
      title: '合同编号',
      dataIndex: 'contract_number',
      key: 'contract_number',
      width: 190,
      render: (value, item) => {
        const href = `${window.location.origin}/crm/contract/${
          item.contract_id
        }`
        return (
          <a target="_blank" href={href}>
            {value}
          </a>
        )
      },
    },
    contractExecuteDateRange: {
      title: '合同执行日期',
      dataIndex: 'contractExecuteDateRange',
      key: 'contractExecuteDateRange',
      width: 190,
      render: (text, item) => {
        const {contract_start_date: start, contract_end_date: end} = item
        return renderDateRange(start, end)
      },
    },
    inFrame: {
      title: '是否框架内合同',
      dataIndex: 'in_frame',
      key: 'in_frame',
      render: text => (text.toString() === '1' ? '是' : '否'),
      width: 140,
    },
    contractStatus: {
      title: '合同状态',
      dataIndex: 'contract_status',
      key: 'contract_status',
      width: 80,
      render: R.prop(R.__, CONTRACT_STATUS_MAP), // eslint-disable-line no-underscore-dangle
    },
    company: {
      title: '签约公司',
      dataIndex: 'company',
      key: 'company',
      width: 180,
      render: renderCompany,
    },
    selfCompany: {
      title: '我方签约公司',
      dataIndex: 'self_company',
      key: 'self_company',
      width: 180,
      render: R.prop(R.__, selfCompany), // eslint-disable-line no-underscore-dangle
    },
    contractInvoiceStatus: {
      title: '合同开票状态',
      dataIndex: 'contract_invoice_status',
      key: 'contract_invoice_status',
      width: 110,
      render: R.prop(R.__, CONTRACT_INVOICE_STATUS_MAP), // eslint-disable-line no-underscore-dangle
    },
    contractPrice: {
      title: '合同金额',
      dataIndex: 'contract_price',
      key: 'contract_price',
      width: 120,
      render: localeString,
    },
    contractInvoicePrice: {
      title: '合同已开票金额',
      dataIndex: 'contract_invoice_price',
      key: 'contract_invoice_price',
      width: 120,
      render: localeString,
    },
    contractInvoiceLeftPrice: {
      title: '合同剩余开票金额',
      dataIndex: 'contract_invoice_left_price',
      key: 'contract_invoice_left_price',
      width: 150,
      render: localeString,
    },
    expenseType: {
      title: '费用类型',
      dataIndex: 'expense_type',
      key: 'expense_type',
      width: 180,
      render: value => expenseType[value],
    },
    applyNumber: {
      title: '申请单编号',
      dataIndex: 'apply_number',
      key: 'apply_number',
      width: 150,
      render: (value, item) => (
        <Link to={`/crm-v2/invoice/${item.invoice_id}/detail`}>{value}</Link>
      ),
    },
    invoiceDate: {
      title: '开票时间',
      dataIndex: 'invoice_audit_date',
      key: 'invoice_audit_date',
      width: 150,
      render: getDateTime,
    },
    invoiceStatus: {
      title: '发票状态',
      dataIndex: 'invoice_status',
      key: 'invoice_status',
      width: 90,
      render: R.prop(R.__, INVOICE_STATUS_MAP), // eslint-disable-line no-underscore-dangle
    },
    auditorName: {
      title: '开票人',
      dataIndex: 'auditor_info',
      key: 'auditor_info',
      width: 80,
      render: R.propOr('', 'name'),
    },
    invoiceTitle: {
      title: '发票抬头',
      dataIndex: 'invoice_title',
      key: 'invoice_title',
      width: 150,
    },
    invoicePrice: {
      title: '发票金额',
      dataIndex: 'invoice_price',
      key: 'invoice_price',
      width: 120,
      render: R.compose(renderNoBreakSpan, localeString),
    },
    applyDate: {
      title: '申请时间',
      dataIndex: 'invoice_apply_date',
      key: 'invoice_apply_date',
      width: 150,
      render: getDateTime,
    },
    creatorName: {
      title: '申请人',
      dataIndex: 'creator_info',
      key: 'creator_info',
      width: 80,
      render: R.propOr('', 'name'),
    },
    invoicePriceToReview: {
      title: '待确认开票金额',
      dataIndex: 'invoice_price',
      key: 'invoice_price',
      width: 120,
      render: localeString,
    },
  }

  return allFields
}

const ListTable = props => {
  const {
    data,
    commonFieldsShow,
    privateFields = {},
    pagination = {},
    dictionary = {},
    rowKey = 'id',
    loading,
  } = props

  const commonFields = getFields({dictionary})
  const allFields = {...commonFields, ...privateFields}
  const columns = [
    ...commonFieldsShow.map(field => allFields[field]),
    ...privateFields,
  ]

  const newPagination = {
    defaultPageSize: 20,
    defaultCurrent: 1,
    ...pagination,
  }
  const scrollX = R.sum(R.map(R.propOr(100, 'width'), columns))

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={rowKey}
      pagination={newPagination}
      scroll={{x: scrollX, y: '800px'}}
      loading={loading}
    />
  )
}

const mapStateToProps = state => ({
  dictionary: state.global.dictionary,
  loading: state.loading.models.invoices,
})

export default connect(mapStateToProps)(ListTable)
