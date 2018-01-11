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

const userInSchema = {
  'properties': {
    'id': {
      'description': 'ID',
      'type': 'string'
    },
    'name': {
      'description': 'Name',
      'type': 'string'
    },
    'birthday': {
      'description': '',
      'example': '2018-01-06 10:59:20',
      'type': 'string',
      'format': '',
    }
  },
  'required': [
    'name',
    'birthday'
  ],
  'type': 'object'
}
const userOutSchema = {
  'properties': {
    'id': {
      'description': 'ID',
      'type': 'string'
    },
    'name': {
      'description': 'Name',
      'type': 'string'
    },
    'birthday': {
      'description': '',
      'example': '2018-01-06 10:59:20',
      'type': 'string',
      'format': '',
    }
  },
  'type': 'object'
}
const userQuerySchema = {
  'properties': {
    'id': {
      'description': 'ID',
      'type': 'string'
    },
    'name': {
      'description': 'Name',
      'type': 'string'
    },
    'birthday': {
      'description': '',
      'example': '2018-01-06 10:59:20',
      'type': 'string',
      'format': '',
    }
  },
  'type': 'object'
}

const userPage: Types.Page<User, User, UserQuery> = {
  domains: {
    name: 'user',
    in: {
      schema: userInSchema,
      schemaType: 'json-schema',
      empty: {
        id: '',
        name: '',
        birthday: '2018-01-06 10:59:20',
      },
    },
    out: {
      schema: userOutSchema,
      schemaType: 'json-schema',
      empty: {
        id: '',
        name: '',
        birthday: '2018-01-06 10:59:20',
      },
    },
    query: {
      schema: userQuerySchema,
      schemaType: 'json-schema',
      empty: {
        id: '',
        name: '',
      },
    }
  },
  apis: {
    createOne: {
      url: '/api/user/create',
      method: 'POST',
    },
    updateOne: {
      url: '/api/user/:id',
      method: 'PUT',
    },
    removeOne: {
      url: '/api/user/:id',
      method: 'POST',
    },
    queryOne: {
      url: '/api/user/:id',
      method: 'GET',
    },
    queryList: {
      url: '/api/users',
      method: 'GET',
    },
  },
  ui: {
    table: {
      columns: [{
        dataIndex: 'id',
        title: 'ID',
      }, {
        dataIndex: 'name',
        title: '名字',
      }, {
        dataIndex: 'birthday',
        title: '生日',
      }]
    },
    form: {
      fields: [{
        name: 'name',
        label: '名字',
        input: {
          type: 'text',
        },
        required: true,
      }, {
        name: 'birthday',
        label: '生日',
        input: {
          type: 'datetime',
        },
        required: true,
      }]
    },
    searchForm: {
      fields: [{
        name: 'id',
        label: 'ID',
        input: {
          type: 'text',
        },
        required: true,
      }, {
        name: 'name',
        label: '名字',
        input: {
          type: 'text',
        },
        required: true,
      }, ]
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
