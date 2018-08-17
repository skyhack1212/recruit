const commonData = {
  profession: 'IT互联网',
  major: '研发',
  company: '脉脉',
  email: 'lidong@taou.com',
  work_time: 1,
  degree: 1,
  province: '北京',
  city: '海淀区',
  salary: 4,
  salary_min: 25000,
  salary_max: 40000,
  stags: 'Python,Linux开发',
  custom_text: '股票期权',
  description: '商业产品技术部招聘项目组',
  address: '北京海淀区学院路甲5号768创意产业园区B座南区1号门2202',
  send_rec: 0,
  sdegree: '本科及以上',
  worktime: '3-5年',
  state: 'valid',
}

export const jobs = [
  {
    jid: 1,
    webjid: 1,
    position: 'Python 工程师',
    ...commonData,
  },
  {
    jid: 2,
    webjid: 3,
    position: 'Java 工程师',
    ...commonData,
  },
  {
    jid: 3,
    webjid: 4,
    position: 'PHP 工程师',
    ...commonData,
  },
  {
    jid: 4,
    position: '运维工程师',
    ...commonData,
  },
]

export const jobDetail = {
  ...commonData,
  position: 'Python高级研发工程师',
  province: '北京',
  sdegree: '本科及以上',
  worktime: '3-5年',
  salary: '25k-45k/月',
  clogo:
    'http://i9.taou.com/maimai/c/offlogo/148d7b36b4590bca8d7fabcdb3db7ad0.png',
  company: '脉脉',
  domain: 'IT互联网,社交',
  stage: 'C轮',
  people: '100~500人',
  description:
    '本科及以上3-5年PythonSQL/数据库模具\n精通python+django。\n熟练使用数据库，linux。\n有一定的架构思路，或有一定的产品思路。\n这里需要技术专家，也需要业务尖兵。\n\n因人设岗，欢迎你的到来！\n这里有底蕴，有理想，有空间，有回报！\n\n脉脉福利本身就很全面和有竞争力：补充保险，加班打车，租房补贴，早中晚餐，按摩，零食，出国旅游，等等，不在话下。\n\n我们是商业产品团队，有额外激励，保证有惊喜，有惊喜，有惊喜！！！',
  stags: 'Python,Linux开发',
  jid: '2',
}
