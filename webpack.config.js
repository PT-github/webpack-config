const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js', // 打包入口
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // 打包输出文件夹
    publicPath: '/' // 针对打包出来js/image或其他静态文件资源引入html时的前缀，多数情况下以/结束
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 9000,
    hot: true, // 模块热替换
    historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    compress: true,
    overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    // proxy: { // 代理配置
    //   '/api': 'http://localhost:3000',
    //   changeOrigin: true
    // }
    stats: {
      all: false,
      modules: false,
      errors: true,
      warnings: true,
      moduleTrace: true, // 显示警告/错误的依赖和来源
      version: true, // 添加 webpack 版本信息
      errorDetails: true// 添加错误的详细信息
    },
    useLocalIp: true,
    //watchOptions: {} // 模块改动通知设置（一般在项目比较大或电脑配置比较低的情况下配置），设置poll文件轮询时间、aggregateTimeout设置文件变更聚合到一次webpack重新构建的延迟时间
  },
  devtool: '', // 生产 none 开发 'cheap-module-eval-source-map'
  module: {
    rules: [
      /* config.module.rule('eslint') */
      {
        enforce: 'pre',
        test: /\.(vue|(j|t)sx?)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'eslint-loader',
            options: {
              extensions: ['.js', '.jsx', '.vue'],
              cache: true,
              emitWarning: true,
              emitError: false,
              formatter: undefined
            }
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, './node_modules/.cache/babel-loader')
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, './node_modules/.cache/vue-loader')
            }
          },
          {
            loader: 'vue-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, './node_modules/.cache/vue-loader')
            }
          }
        ]
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              plugins: [
                function () { /* omitted long function */ }
              ]
            }
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
              modules: {
                localIdentName: '[name]_[local]_[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              plugins: [
                function () { /* omitted long function */ }
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new VueLoaderPlugin(),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        title: 'vue-test',
        template: path.resolve('./public/index.html'),
        inject: true
      }
    ),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.jsx', '.vue', '.json']
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\?.*)?$/i,
        extractComments: false,
        sourceMap: true,
        terserOptions: {
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_props: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            typeofs: false
          },
          mangle: {
            safari10: true
          }
        }
      })
    ]
  },
  // performance: { // 这些选项可以控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
  //   hints: 'false' // 开发推荐关闭 生产推荐 error
  // }
}