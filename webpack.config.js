var rucksack = require('rucksack-css')
var webpack = require('webpack')
var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ENV = process.env.NODE_ENV || 'development'
var isProd = ENV === 'production'
var WebpackErrorNotificationPlugin = require('webpack-error-notification')
var FB_ID = process.env.FB_ID || '329879750722396'

module.exports = {
  debug: !isProd,
  cache: !isProd,
  devtool: isProd ? '#eval' : '#cheap-module-eval-source-map',
  context: path.join(__dirname, 'web'),
  entry: {
    index: './index.js',
  },
  output: {
    path: path.join(__dirname, 'client-dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [/web/, /shared/],
        loader: getBabelLoader(),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        include: /web/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
        ],
      },
      {
        test: /\.css$/,
        exclude: /web/,
        loader: 'style!css',
      },
      {
        test: /\.(png|jpg|wav)$/,
        loader: 'file',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(woff(2)|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    unsafeCache: true,
  },
  postcss: [
    rucksack({
      autoprefixer: true,
    }),
  ],
  plugins: (function () {
    var plugins = [
      new HtmlWebpackPlugin({
        template: 'index.ejs',
      }),
      new WebpackErrorNotificationPlugin(),
      new webpack.DefinePlugin({
        FB_ID: JSON.stringify(FB_ID),
        __DEV__: JSON.stringify(!isProd),
        'process.env': {
          IS_WEB: JSON.stringify(true),
          NODE_ENV: JSON.stringify(ENV),
        },
      }),
    ]

    if (isProd) {
      plugins.push(new CopyWebpackPlugin([
        { from: './android*', to: './' },
        { from: './apple-touch-icon.png', to: './' },
        { from: './browserconfig.xml', to: './' },
        { from: './favicon*', to: './' },
        { from: './manifest.json', to: './' },
        { from: './mstile-150x150.png', to: './' },
        { from: './safari-pinned-tab.svg', to: './' },
      ]))
      plugins.push(new webpack.optimize.OccurrenceOrderPlugin(false))
      plugins.push(new webpack.optimize.DedupePlugin())
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        screwIe8: true,
        compress: {
          warnings: false,
        },
        output: {
          comments: false,
        },
      }))
    }

    return plugins
  }()),
  devServer: {
    contentBase: './web',
    hot: !isProd,
  },
}

// we load it here instead of a .babelrc file so react native won't be affected
function getBabelLoader () {
  return 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react&plugins[]=react-hot-loader/babel,plugins[]=transform-async-to-generator,plugins[]=transform-runtime'
}
