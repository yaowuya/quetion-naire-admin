import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login'),
    hidden: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/Register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/questionnaire',
    component: Layout,
    redirect: '/questionnaire/question',
    name: 'Questionnaire',
    meta: { title: '问卷管理', icon: 'link' },
    alwaysShow: true,
    children: [
      {
        path: '/question',
        name: 'Question',
        component: () => import('@/views/question/Question'),
        meta: { title: '问卷' }
      },
      {
        path: '/topic',
        name: 'Topic',
        component: () => import('@/views/question/Topic'),
        meta: { title: '题型' }
      },
      {
        path: '/title',
        name: 'Title',
        component: () => import('@/views/question/Title'),
        meta: { title: '题目' }
      },
      {
        path: '/option',
        name: 'Option',
        component: () => import('@/views/question/Option'),
        meta: { title: '选项' }
      },
      {
        path: '/answer',
        name: 'Answer',
        component: () => import('@/views/question/Answer'),
        meta: { title: '答案' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    name: 'System',
    meta: { title: '系统管理', icon: 'set' },
    alwaysShow: true,
    children: [
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/system/Role'),
        meta: { title: '角色' }
      },
      {
        path: '/person',
        name: 'Person',
        component: () => import('@/views/system/Person'),
        meta: { title: '用户' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
