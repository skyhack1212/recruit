import * as R from 'ramda'

const staff = {
  to_ucard: {
    id: 14402564,
    name: '刘泽民',
    career: '脉脉测试工程师',
    avatar: 'http://i9.taou.com/maimai/p/2729/1309_109_q18gZR09Jsbgpm-a160',
  },
  staff: {
    uh_total: 781,
    uh_left: 769,
    addfr_total: 5600,
    addfr_left: 5495,
    req_resume_total: 3500,
    req_resume_left: 3500,
    exposure_total: 100,
    exposure_left: 100,
    connect_total: 100,
    connect_left: 100,
    st: 1, // 0 代表不同意， 1 代表同意
  },
}
export default {
  'GET /api/ent/rights/v1/staff': (req, res) => {
    const data = R.range(1, 7).map(id =>
      R.set(R.lensPath(['to_ucard', 'id']), id, staff)
    )
    res.json({data})
  },
  'GET /api/ent/rights/v1/staff/add': (req, res) => {
    res.json({code: 0})
  },
  'GET /api/ent/rights/v1/staff/del': (req, res) => {
    res.json({code: 0})
  },
  'GET /api/ent/user/v1/get_by_mobile': (req, res) => {
    res.json({
      found: 1,
      ucard2: {
        id: 19027922,
        province: '北京',
        name: '王艳琴',
        career: '脉脉前端开发工程师',
        avatar: 'http://i9.taou.com/maimai/p/9577/5735_82_k1CnY9whPOmgXL-a160',
        mp_is_admin: 1,
      },
      ret: 1,
      result: 'ok',
      code: 0,
    })
  },
}
