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
    path: '/imagetext',
    name: 'imagetext',
    meta: { title: '图文文档案例'},
    component: () => import('views/ImageText.vue')
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
  {
    path: '/irreg',
    name: 'irreg',
    meta: { title: '不规则表格案例'},
    component: () => import('views/irregular.vue')
  },
  {
    path: '/photoalbum',
    name: 'photoalbum',
    meta: { title: '组件展示'},
    component: () => import('views/PhotoAlbum.vue')
  },
  {
    path: '/laboratory',
    name: 'laboratory',
    meta: { title: '实验室'},
    component: () => import('views/laboratory.vue')
  },
]

export default asyncRoutes