const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');//html模板
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const postcssOpts = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
  ],
  modifyVars: {
    '@primary-color': '#fc5a59',
    '@link-color': '#1DA57A',
    '@border-radius-base': '2px',
  },
  javascriptEnabled: true,
};

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    disableHostCheck: true
  },

  entry: {
    "index": path.resolve(__dirname, 'src/index'),
    //添加要打包在vendor.js里面的库
    vendor: ['react', 'react-dom', 'react-router']
  },

  output: {
    filename: '[name].[chunkhash:5].js',
    chunkFilename: '[id].chunk.js',
    path: path.join(__dirname, '/build'),
  },

  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.join(__dirname, 'src')],
    extensions: ['.web.js', '.jsx', '.js', '.json'],
    //设置别名方便引用
    alias: {
      Comps: path.resolve(__dirname, 'src/components/'),//组件
      Utils: path.resolve(__dirname, 'src/util/'),//工具包
      RestUrl: path.resolve(__dirname, 'src/actions/RestUrl/'),//rest、http服务地址
      Img: path.resolve(__dirname, 'src/assets/img/'),//图片
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }, {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader?limit=8192&name=img/[name]_[hash:5].[ext]"
      }, {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: "url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]"
      }, {
        test: /\.less$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {loader: 'postcss-loader', options: postcssOpts},
            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  '@primary-color': '#5578DC',
                  '@link-color': '#5578DC',
                  '@border-radius-base': '2px',
                },
                javascriptEnabled: true,
              }
            },
          ]
        })
      }, {
        test: /\.scss$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {loader: 'postcss-loader', options: postcssOpts},
            'sass-loader'
          ]
        })
      }, {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', {loader: 'postcss-loader', options: postcssOpts}
          ]
        })
      }, {
        test: /\.svg$/i,
        use: 'svg-sprite-loader',
        include: [
          require.resolve('antd').replace(/warn\.js$/, ''),  // antd-mobile使用的svg目录
          path.resolve(__dirname, './src/'),  // 个人的svg文件目录，如果自己有svg需要在这里配置
        ]
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin(
      ['build/*'],　                    //匹配删除的文件
      {
        root: __dirname,       　　　　　  //根目录
        verbose: true,        　　　　　　 //开启在控制台输出信息
        dry: false        　　　　　　　　 //启用删除文件
      }
    ),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './public/favicon.ico', // 添加小图标
    }),
  ]
}
