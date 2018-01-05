import MockAdapter from 'axios-mock-adapter'

let mockUsers = Array(100).fill(0).map((_, i) => ({
  id: i + '',
  name: 'User' + i,
  birthday: '2000-01-01',
}))
function getUser(config) {
  return (config.url && config.url.match(/\/user\/(\d+)/) || ['0'])[1]
}
function parseData(data: string | object) {
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return data
}
export default function mockUserApi(axios: any) {
  const mock = new MockAdapter(axios)
  mock.onGet('/api/users').reply(config => {
    const params = config.params
    return [200, {
      start: params.start,
      limit: params.limit,
      list: mockUsers.slice(params.start || 0, (params.start || 0) + (params.limit || 10)),
      total: mockUsers.length,
    }]
  })

  mock.onGet(/\/user\/\d+\/?/).reply(config => {
    const id = getUser(config)
    return [200, mockUsers.find(u => u.id === id) || {}]
  })

  mock.onPut(/\/user\/(\d+)\/?/).reply(config => {
    const id = getUser(config)
    let m = mockUsers
    const i = mockUsers.findIndex(u => u.id === id)
    if (i >= -1) {
      mockUsers[i] = {
        ...mockUsers[i],
        ...parseData(config.data),
      }
    }
    console.log('mock update:', mockUsers[i])
    return [200, mockUsers[i]]
  })

  mock.onGet().reply(config => {
    console.log(config)
    return [404, config]
  })

  mock.onPost(/\/api\/user\/create\/?/).reply(config => {
    let m = mockUsers
    const id = Number(mockUsers[mockUsers.length - 1].id) + 1
    const newUser = {
      ...parseData(config.data),
      id,
    }
    mockUsers.push(newUser)
    return [200, newUser]
  })

  mock.onDelete(/\/api\/user\/\d+\/?/).reply(config => {
    const id = getUser(config)
    let m = mockUsers
    mockUsers = mockUsers.filter(u => u.id !== id)
    return [200, m.find(u => u.id === id)]
  })
}
