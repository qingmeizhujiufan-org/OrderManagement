const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');//html模板
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const CustomTheme = require('./src/util/customTheme');

const postcssOpts = {
    ident: 'postcss',
    plugins: () => [
        autoprefixer({
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
        }),
    ]
};

module.exports = {
    devtool: 'inline-source-map',
    devServer: {
        disableHostCheck: true
    },

    entry: {
        "index": path.resolve(__dirname, 'src/index')
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
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, 'src')
        ],
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
                            "env",
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
                    require.resolve('antd').replace(/warn\.js$/, ''),
                    path.resolve(__dirname, './src/'),
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            ['build/*'],　                    //匹配删除的文件
            {
                root: __dirname,       　　　　　  //根目录
                verbose: true,        　　　　　　 //开启在控制台输出信息
                dry: false        　　　　　　　　 //启用删除文件
            }
        ),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, '.', 'dll'),
            manifest: require('./dll/vendor-manifest.json')
        }),
        new ExtractTextPlugin({filename: '[name].[contenthash:5].css', allChunks: true}),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico', // 添加小图标
        }),
        new HtmlWebpackIncludeAssetsPlugin({assets: ['../dll/vendor.dll.js'], append: false}),
        /* 分析包的大小分布 */
        // new BundleAnalyzerPlugin(),
    ]
}
