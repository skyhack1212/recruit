import * as R from 'ramda'
import {jobDetail} from './data/job'
import dictionary from './data/dictionary'

export default {
  // 职位列表
  'GET /api/ent/job/v1/list': (req, res) => {
    const {query: {page = 1}} = req
    const list = R.range(1, 20).map(id => ({
      ...jobDetail,
      jid: page * 20 + id,
      webjid: page * 20 + id,
      state: id % 2 === 0 ? 'valid' : 'close',
    }))
    res.json({
      count: 20, // 返回的数量
      total_max: 1769, // 实际总数
      jobs: list,
      remain: 1, // 是否还有数据
      result: 'ok',
      total: 1000, // 可拉数据的总数
    })
  },
  // 修改职位状态
  'GET /api/ent/job/v1/up_state': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 发布职位
  'POST /up_job': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 获取常量
  '/api/ent/common/v1/const': (req, res) => {
    res.json(dictionary)
  },
  // 获取职位详情，用于修改
  '/api/ent/job/v1/add_job_get': (req, res) => {
    const {query: {webjid}} = req
    const emptyData = {
      company: '脉脉',
    }

    res.json({
      code: 0,
      job: webjid ? jobDetail : emptyData,
    })
  },
}
