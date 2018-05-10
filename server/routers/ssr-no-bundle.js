const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const VueServerRender = require('vue-server-renderer')
const bundle = require('../../server-build/server-entry.js').default

const serverRender = require('./server-render-no-bundle')

const clientManifest = require('../../public/vue-ssr-client-manifest.json')
const renderer = VueServerRender.createRenderer(
  {
    inject: false,
    clientManifest
  }
)

const template = fs.readFileSync(
  path.join(__dirname, '../server.template.ejs'),
  'utf-8'
)

const pageRouter = new Router()

pageRouter.get('*', async (ctx) => {
  await serverRender(ctx, renderer, template, bundle)
})

module.exports = pageRouter
