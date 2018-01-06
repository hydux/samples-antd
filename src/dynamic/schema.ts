import * as Types from '../consts/schema'

interface User {
  id: string,
  name: string,
  birthday: string
}

interface UserQuery {
  name: string
  id: string
}

const userSchema = {
  'properties': {
    'id': {
      'description': 'ID',
      'type': 'string'
    },
    'name': {
      'description': 'Name',
      'type': 'string'
    },
    'time': {
      'description': '',
      'example': '2018-01-06 10:59:20',
      'type': 'date'
    }
  },
  'required': [
    'liked',
    'likers_count',
    'abstract',
    'comment_count',
    'can_access',
    'price',
    'photos',
    'length',
    'html',
    'onlook_count',
    'time',
    'is_onlooked',
    'rec_count'
  ],
  'type': 'object'
}

const userPage: Types.Page<User, User, UserQuery> = {
  domains: {
    in: {
      schema: {

      },
      empty: {
        id: '',
        name: '',
        birthday: '2017-12-12',
      }
    }
  }
}

const schema: Types.Routes = {
  path: '/',
  children: [{
    path: '/general',
    label: 'General',
    children: [{
      path: '/users',
      label: '用户',
    }]
  }]
}
