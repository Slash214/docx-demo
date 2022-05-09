import { RouteRecordRaw } from "vue-router";

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: {},
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    meta: { title: '首页'},
    component: () => import('views/index.vue')
  },
  {
    path: '/graphic',
    name: 'graphic',
    meta: { title: '图文案例'},
    component: () => import('views/graphic.vue')
  },
  {
    path: '/table',
    name: 'table',
    meta: { title: '表格案例'},
    component: () => import('views/table.vue')
  },
]

export default asyncRoutes