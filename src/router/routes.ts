//对外暴露配置路由（常量路由)
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true, //在菜单中需要隐藏
    },
  },

  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: '',
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'Interface',
    meta: {
      title: '',
      hidden: false,
    },
    children: [
      {
        path: '/interface_info',
        component: () => import('@/views/interface_info/index.vue'),
        meta: {
          title: '接口管理',
          hidden: false,
          icon: 'VideoPause',
        },
      },
    ],
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'Avatar',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Memo',
        },
      },
    ],
  },

  {
    path: '/error',
    component: () => import('@/layout/index.vue'),
    name: 'error',
    meta: {
      title: '错误页面',
      hidden: false,
      icon: 'Failed',
    },
    redirect: '/error/403',
    children: [
      {
        path: '/error/403',
        component: () => import('@/views/errors/403.vue'),
        name: '403',
        meta: {
          title: '403',
          hidden: false,
        },
      },
      {
        path: '/error/404',
        component: () => import('@/views/errors/404.vue'),
        name: '404',
        meta: {
          title: '404',
          hidden: false,
        },
      },
      {
        path: '/error/500',
        component: () => import('@/views/errors/500.vue'),
        name: '500',
        meta: {
          title: '500',
          hidden: false,
        },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
    },
  },
]
