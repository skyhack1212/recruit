import * as R from 'ramda'
const path = require('path')
const joinPath = path.join.bind(null, __dirname)

// 此处原代码有问题- - 当文件名称为 a/b/c 开头时， mock数据丢失。 原因: reduce 方法 currentFileName === 'data' 时返回了undefined 导致 之前的数据丢失
module.exports = require('fs')
  .readdirSync(joinPath('/mock'))
  .filter(fileName => fileName !== 'data')
  .reduce(
    (prev, currentFileName) =>   
    ({ 
        ...prev,
        ...require(`./mock/${currentFileName}`),
      }), {}
  )
