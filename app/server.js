const next = require('next')
const app = next({ dir: __dirname, dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  require('http')
    .createServer((req, res) => handle(req, res))
    .listen(process.env.PORT || 3000, () => {
      console.log('> Ready on http://localhost:' + (process.env.PORT || 3000))
    })
})