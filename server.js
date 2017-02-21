import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import DashboardPlugin from 'webpack-dashboard/plugin'
import config from './webpack.config.babel'

const app = new (require('express'))()
const port = 3000
const env = process.env.NODE_ENV
const DEV = env === 'development'

const compiler = webpack(config)

compiler.apply(new DashboardPlugin())

app.use(webpackDevMiddleware(
    compiler,
    {
        noInfo: true,
        publicPath: config.output.publicPath
    }
))
app.use(webpackHotMiddleware(compiler))

app.get("*", function(req, res) {
  res.sendFile(`${ __dirname }/index${ DEV ? '_dev' : '' }.html`)
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info(
      `==> 🌎  Online Cameras application listening on port ${
        port
      }. Open up http://localhost:${
        port
      }/ in your browser.`
    )
  }
})
