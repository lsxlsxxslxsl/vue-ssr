module.exports = (isDev) => {
  return {
    preserveWhitepace: true, // 去掉vue模板中多余空格
    extractCSS: !isDev, // vue文件默认不单独打包css，这个会单独打包到css文件
    cssModules: {
      localIndentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]', // 调用之后会生成格式名字,这样写方便看文件目录
      camelCase: true
    },
    //hotReload: false // vue组件热重载，默认生产环境开启，开发环境关闭,样式热重载是vue-style-loader实现的。此处我们根据环境变量生成，不需要设置
  }
}
