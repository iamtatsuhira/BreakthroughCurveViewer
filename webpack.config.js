const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    // モード
    // development|production|none
    mode: 'development',

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: {
        "js": "./src/index.js"
    },

    // ファイルの出力設定
    output: {
        //  出力ディレクトリ
        // __dirnameは webpack.config.js があるディレクトリの絶対パス
        path: `${__dirname}/public/static`,

        // 出力ファイル名
        // [name]はentryがハッシュの場合、keyで置換される
        filename: '[name]/main.js'
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,// javascriptとしてバンドルせず css として出力する
                    // CSSをバンドル
                    {
                        loader: 'css-loader',
                        options: {
                            // オプションでCSS内のurl()メソッドの取り込まない
                            url: false,
                            // ソースマップの利用有無
                            sourceMap: true,
                            // Sass+PostCSSの場合は2を指定
                            importLoaders: 2
                        },
                    },
                    // PostCSSのための設定
                    {
                        loader: 'postcss-loader',
                        options: {
                            // PostCSS側でもソースマップを有効にする
                            sourceMap: true,
                            // ベンダープレフィックスを自動付与する
                            plugins: () => [require('autoprefixer')]
                        },
                    },
                    // Sassをバンドル
                    {
                        loader: 'sass-loader',
                        options: {
                            // ソースマップの利用有無
                            sourceMap: true,
                        }
                    },
                ]
            },
            {
                test: /\.js$/,
                use: [
                    'ify-loader',
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            // prefix は output.path
            filename: 'css/main.css',
        })
    ],
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    // source-map方式でないと，CSSの元ソースが追跡できないため
    devtool: "source-map"
};