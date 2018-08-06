import * as R from 'ramda'
import talent from './data/talent'
import {jobs, jobDetail} from './data/job'

export default {
  'GET /api/ent/find/v1/search': (req, res) => {
    const {query: {page = 1, keyword}} = req
    if (!keyword) {
      res.json({
        contacts: [],
        remain: 0,
      })
    }
    const list = R.range(1, 20).map(id => ({
      ...talent,
      id: (page - 1) * 20 + id,
    }))
    res.json({
      count: 20, // 返回的数量
      total_max: 1769, // 实际总数
      contacts: list,
      remain: 1, // 是否还有数据
      result: 'ok',
      total: 1000, // 可拉数据的总数
    })
  },
  'GET /api/ent/recruit/v1/list': (req, res) => {
    const {query: {page = 1}} = req
    const list = R.range(1, 20).map(id => ({
      ...talent,
      id: (page - 1) * 20 + id,
    }))
    res.json({
      count: 20, // 返回的数量
      total_max: 1769, // 实际总数
      list,
      remain: 1, // 是否还有数据
      result: 'ok',
      total: 1000, // 可拉数据的总数
    })
  },
  // 归档
  'POST /api/ent/recruit/v1/archive': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 职位列表
  'GET /api/ent/job/v1/namelist': (req, res) => {
    res.json({
      jobs,
    })
  },
  // 批量联系
  'POST /api/ent/connect/v1/batch_send': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 单个联系/api/ent/connect/v1/send
  'POST /api/ent/connect/v1/send': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 标记为淘汰
  'POST /api/ent/recruit/v1/elimination': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 标记为 完成
  'POST /api/ent/recruit/v1/complete': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 回复消息
  'POST /api/ent/recruit/v1/reply': (req, res) => {
    res.json({
      code: 0,
    })
  },
  /* mobile */
  // 获取 job 详情
  'GET /api/ent/job/v1/get': (req, res) => {
    res.json({
      code: 0,
      job: jobDetail,
    })
  },
  // 同意脉信或者电话联系
  'GET /api/ent/connect/v1/agree': (req, res) => {
    res.json({
      code: 0,
    })
  },
  // 不同意联系
  'GET /api/ent/connect/v1/disagree': (req, res) => {
    res.json({
      code: 0,
    })
  },
}
