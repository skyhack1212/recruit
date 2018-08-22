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
  // 获取职位极速曝光状态
  'GET /api/ent/exposure/v1/status': (req, res) => {
    res.json({
      code: 0,
      msg: '',
      status: 0,
      // status: 1,
      // pre_comment: '为保证您的招聘效果，将于下周一早上8点开始曝光',
      pre_comment: '',
      push_time: '2018-08-17 17:49:55',
      jid: 1580632,
      view_cnt: 7, //已有view_cnt位候选人查看了职位
      push_cnt: 526, //已将职位送达push_cnt位候选人
      uid: 5482308,
      days: 2, //预计曝光3天，当前第days天
      limit_cnt: 0,
      uptime: '2018-08-17 17:49:55',
      times: 0,
      result: 'ok',
      position: 'Python高级研发工程师',
      id: 21453,
      crtime: '2018-08-17 17:43:57',
      resume_cnt: 5, //已收到resume_cnt份简历
    })
  },
  // 职位极速曝光
  'GET /api/ent/exposure/v1/add': (req, res) => {
    res.json({
      code: 0,
      msg: '',
    })
  },
}
