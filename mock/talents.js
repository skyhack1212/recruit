import * as R from 'ramda'
import talent from './data/talent'
import jobs from './data/job'

export default {
  'GET /api/find/v1/search': (req, res) => {
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
  'GET /api/recruit/v1/list': (req, res) => {
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
  'POST /api/recruit/v1/archive': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'GET /api/job/v1/namelist': (req, res) => {
    res.json({
      jobs,
    })
  },
  'POST /api/recruit/v1/batch_send': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'POST /api/recruit/v1/send': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'POST /api/recruit/v1/elimination': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'POST /api/recruit/v1/complete': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'POST /api/recruit/v1/reply': (req, res) => {
    res.json({
      code: 0,
    })
  },
}
