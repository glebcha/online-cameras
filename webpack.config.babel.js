import path from 'path'
import webpack from 'webpack'
import cssnano from 'cssnano'
import { hash } from './utils/helpers'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const env = process.env.NODE_ENV
const DEV = env === 'development'
const __version__ = hash()

// ------------------------------------
// Default Webpack config
// ------------------------------------
let webpackConfig = {
    devtool: DEV ? 'cheap-module-eval-source-map' : null,
    entry: ['./index'],
    output: {
        path: path.join(__dirname, 'build'),
        filename: DEV ? 'bundle.js' : `bundle${ __version__ }.js`,
        publicPath: DEV ? 'http://localhost:3000/' : '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
            }
        }),
        new ExtractTextPlugin(`[name]${ hash() }.css`, {
            allChunks: false
        }),
        new webpack.ContextReplacementPlugin(
            /moment[\\\/]src[\\\/]locale$/,
            new RegExp("^\.\/(" + (process.env.BUILD_LOCALE || 'ru') + ")$")
        )
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules[\\\/](?!(moment[\\\/]src)[\\\/]).*/,
                include: __dirname
            }
        ]
    }
}

// ------------------------------------
// Plugins
// ------------------------------------
if (DEV) {
  console.log('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.entry.push('webpack-hot-middleware/client')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else {
    console.log(
        'Enable plugins for production (OccurenceOrder, Dedupe, HtmlWebpack & UglifyJS).',
        process.env.BUILD_ENV
    )
    webpackConfig = {
        ...webpackConfig,
        ...{
            imageWebpackLoader: {
                progressive:true,
                optimizationLevel: 7,
                interlaced: false,
                pngquant:{
                    quality: '65-90',
                    speed: 4
                },
                svgo:{
                    plugins: [
                        {
                            removeEmptyAttrs: false,
                            removeComments: true,
                            removeTitle: true,
                            removeUselessDefs: true,
                            removeHiddenElems: true,
                            removeEmptyText: true,
                            removeEmptyContainers: true,
                            minifyStyles: true,
                            convertPathData: true,
                            convertTransform: true,
                            removeUnusedNS: true,
                            cleanupIDs: true
                        }
                    ]
                }
            }
        }
    }

    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './build_template.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
        comments: false,
        mangle: true,
        sourcemap: false,
        compress: {
            sequences: true,
            booleans: true,
            loops: true,
            unused: true,
            warnings: false,
            drop_console: true,
            dead_code: true,
            unsafe: true
        }
    })
  )
}

// ------------------------------------
// Styles
// ------------------------------------
let lessConfig = {
    test: /\.less$/,
    include: __dirname
}
let cssConfig = {
    test: /\.css$/,
    include: __dirname
}

if(DEV) {
    lessConfig.loaders = [
        'style',
        'css?sourceMap',
        'postcss',
        'less?sourceMap'
    ]
    cssConfig.loaders = [
        'style',
        'css?sourceMap',
        'postcss'
    ]
} else {
    lessConfig.loader = ExtractTextPlugin.extract(
        'style',
        'css!postcss!less'
    )
    cssConfig.loader = ExtractTextPlugin.extract(
        'style',
        'css!postcss'
    )
}

webpackConfig.module.loaders.push(lessConfig)
webpackConfig.module.loaders.push(cssConfig)

webpackConfig.sassLoader = {
  includePaths: [path.resolve(__dirname, './styles')]
}

webpackConfig.postcss = [
  cssnano({
    sourcemap: DEV ? true : false,
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['iOS >= 7', 'Safari >= 6', 'Chrome >= 40', 'IE >= 9']
    },
    safe: true,
    discardComments: {
      removeAll: true
    }
  })
]

webpackConfig.module.loaders.push(
    {
        test: /\.woff(\?.*)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff&name=fonts/[name]-[hash].[ext]"
    },
    {
        test: /\.woff2(\?.*)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff&name=fonts/[name]-[hash].[ext]"
    },
    {
        test: /\.ttf(\?.*)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream&name=fonts/[name]-[hash].[ext]"
    },
    {
        test: /\.eot(\?.*)?$/,
        loader: "file-loader?name=fonts/[name]-[hash].[ext]"
    },
    {
        test: /\.svg(\?.*)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml&name=fonts/[name]-[hash].[ext]"
    },
    {
        test: /.*\.(gif|png|jpe?g)$/i,
        loader: 'file?hash=sha512&digest=hex&name=[hash].[ext]'
    }
)

module.exports = webpackConfig
