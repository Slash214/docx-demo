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
]

export default asyncRoutes