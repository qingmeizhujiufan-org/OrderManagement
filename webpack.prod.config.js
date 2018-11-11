const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');//html模板
const autoprefixer = require('autoprefixer');
const CustomTheme = require('./src/util/customTheme');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const postcssOpts = {
    ident: 'postcss',
    plugins: () => [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
    ]
};

module.exports = {
    entry: {
        "index": path.resolve(__dirname, 'src/index'),
        //添加要打包在vendor.js里面的库
        vendor: ['react', 'react-dom', 'react-router', 'react-router-redux', 'react-redux', 'redux']
    },

    output: {
        filename: '[name].[chunkhash:5].js',
        chunkFilename: 'chunk.[chunkhash:5].js',
        path: path.join(__dirname, '/build'),
    },

    externals: {
        '@antv/data-set': '@antv/data-set'
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
                    options: {
                        presets: [
                            "es2015",
                            "stage-0",
                            "react"
                        ],
                        plugins: [
                            "transform-runtime",
                            "transform-decorators-legacy",
                            [
                                "import",
                                {
                                    "libraryName": "antd",
                                    "style": true
                                }
                            ],
                            "lodash"
                        ]
                    }
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
                            options: CustomTheme
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
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
            template: './public/index.html',
            favicon: './public/favicon.ico', // 添加小图标
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        /* 排序输出 */
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash:5].js',
            minChunks: Infinity,
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:5].css',
            allChunks: true
        }),
        /* 最小化 */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: true
        }),
        /* 合并块 */
        new webpack.optimize.AggressiveMergingPlugin(),
        /* 分析包的大小分布 */
        // new BundleAnalyzerPlugin(),
    ]
};
