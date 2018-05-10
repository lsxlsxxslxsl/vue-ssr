import createApp from './create-app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    if (context.user) {
      store.state.user = context.user
    }

    router.push(context.url)

    router.onReady(() => { // 服务端渲染所有异步操作结束才会调用该回调
      // 获取客户端数据并渲染
      const matchedComponents = router.getMatchedComponents() // 根据前端路由url返回不同的组件
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            route: router.currentRoute,
            router,
            store
          })
        }
      })).then(data => {
        context.meta = app.$meta()
        context.state = store.state
        context.router = router
        resolve(app)
      })
    })
  })
}
