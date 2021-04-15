const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5601'
  }))
  app.use('/oauth', createProxyMiddleware({
    target: 'http://localhost:5601'
  }))
}