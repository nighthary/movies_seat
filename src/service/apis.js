import reqwest from 'reqwest'

// 请求地址
// let rootPath = 'http://121.40.176.21:8082/gs_single_sale'
// let rootPath = 'http://192.168.2.223:8889'
let rootPath = 'https://course.goodsogood.com'

// 课程列表
const COURSE_LIST = rootPath + '/app/course/list'
// 课程匪类
const COURSE_CATEGORY = rootPath + '/app/category/list'
// 免登跳转课程详情
export const COURSE_DETAIL = rootPath + '/app/course/detail'

export function getCourseCategories (data, callback) {
  return http(COURSE_CATEGORY, data, 'GET', callback)
}

export function getCourseList (data, callback) {
  return http(COURSE_LIST, data, 'GET', callback)
}

export function getCourseDetail (data, callback) {
  return http(COURSE_DETAIL, data, 'GET', callback)
}

function http (uri, data, method, callback, async) {
  let _params = {
    url: uri,
    data: (typeof data === 'string') ? JSON.parse(data) : data,
    type: 'json',
    method: method,
    crossOrigin: true
  }
  if (async !== undefined) {
    _params.async = async
  }
  reqwest(_params).then(val => callback(null, val)).catch(e => callback(e))
}
