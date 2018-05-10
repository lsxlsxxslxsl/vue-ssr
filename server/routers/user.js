const Router = require('koa-router')

const userRouter = new Router({ prefix: '/user' })

userRouter.post('/login', async ctx => {
  const user = ctx.request.body
  if (user.username === 'jokcy' && user.password === 'jokcy111') {
    ctx.session.user = {
      username: 'jokcy'
    }
    ctx.body = {
      success: true,
      data: {
        username: 'jokcy'
      }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'username or password error'
    }
  }
})

module.exports = userRouter
