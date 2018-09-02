import request from '@/utils/request'

export function fetchBookList (query) {
  return request({
    url: 'books',
    method: 'get',
    params: query
  })
}

export function fetchBook (id) {
  return request({
    url: '/books/' + id,
    method: 'get'
  })
}
