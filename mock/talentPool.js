import * as R from 'ramda'
import talent from './data/talent'

export default {
  // 职位列表
  'GET /api/ent/talent/v1/list': (req, res) => {
    const {query: {page = 1}} = req
    const list = R.range(1, 20).map(id => ({
      ...talent,
      uid: page * 20 + id,
      id: page * 20 + id,
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
  // 修改职位状态
  'GET /api/ent/talent/v1/add': (req, res) => {
    res.json({
      code: 0,
    })
  },
}
