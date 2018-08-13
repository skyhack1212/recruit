import * as R from 'ramda'
import talent from './data/talent'

export default {
  'GET /api/ent/recruit/v1/recommend': (req, res) => {
    const {query: {page = 1, jid}} = req
    if (!jid) {
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
}
