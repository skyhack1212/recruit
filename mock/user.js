export default {
  'GET /api/ent/user/v1/get': (req, res) => {
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
      company: {
        is_owner: 0,
        company_url: 'https://maimai.cn/company?webcid=13DPDwuRC&self=0',
        stdname: '脉脉',
        result: 'ok',
        address: '中关村768产业园',
        clogo:
          'http://i9.taou.com/maimai/c/offlogo/148d7b36b4590bca8d7fabcdb3db7ad0.png',
      },
      ret: 1,
      result: 'ok',
    })
  },
}
