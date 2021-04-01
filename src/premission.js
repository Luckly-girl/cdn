// permission.js
import router from '@/router'
import store from '@/store'
import Bus from "@/utils/bus";

const whiteList = ['/login', '/regist']

const getRolesFn = (to, from, next) => {
  if (store.getters.roles.length === 0) {
    store.dispatch('GetUserPerms').then(res => {
      store.dispatch('GenerateRoutes').then(res => {
        router.addRoutes(store.getters.addRouters)
        next({ ...to, replace: true })
      })
    })
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/regist') {
    store.dispatch('CleenAllState')
    Bus.$emit('loginOut', true)
    next()
  } else {
    if (!localStorage.getItem('token')) {
      next({
        path: '/'
      })
    }
    document.onkeydown = null
    let token = localStorage.getItem('token')
    let userString = decodeURIComponent(escape(window.atob(token.split('.')[1])))
    let flag = JSON.parse(userString).username !== store.getters.userInfo.username
    if (!store.getters.userInfo.username || flag) {
      store.dispatch('GetUserInfo').then(res => {
        Bus.$emit('loginIn', true)
        getRolesFn(to, from, next)
      })
    } else {
      getRolesFn(to, from, next)
    }
  }
})


router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})