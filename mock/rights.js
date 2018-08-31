const rights = {
  type: 'addfr', // (添加好友) | uh （极速联系） |  req_resume（索要简历） |  exposure（极速曝光）|  staff (员工)  |  connect（职位邀请）
  left: 728980,
  give: 22890,
  total: 741048,
  used: 4,
}

export default {
  'GET /api/ent/rights/v1/info': (req, res) => {
    const data = {
      data: {
        company: {
          is_owner: 0,
          company_url: 'https://maimai.cn/company?webcid=13DPDwuRC&self=0',
          stdname: '脉脉',
          result: 'ok',
          address: '中关村768产业园',
          clogo:
            'http://i9.taou.com/maimai/c/offlogo/148d7b36b4590bca8d7fabcdb3db7ad0.png',
        },
        rights: [
          {
            ...rights,
            type: 'addfr',
          },
          {
            ...rights,
            type: 'uh',
          },
          {
            ...rights,
            type: 'req_resume',
          },
          {
            ...rights,
            type: 'exposure',
          },
          {
            ...rights,
            type: 'staff',
          },
          {
            ...rights,
            type: 'connect',
          },
        ],
      },
    }
    res.json(data)
  },
  'POST /api/ent/rights/v1/staff/give': (req, res) => {
    res.json({
      code: 0,
    })
  },
  'POST /api/ent/rights/v1/staff/take': (req, res) => {
    res.json({
      code: 0,
    })
  },
}
