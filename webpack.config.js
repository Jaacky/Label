const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    entry: {
        label: "./src/label/index.jsx",
        background: "./src/background_scripts/background.js",
        content: "./src/content_scripts/toggle_label.jsx",
        content: "./src/scss/content.scss",
    },
    output: {
        path: `${__dirname}/build`,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(sc|c)ss$/,
                exclude: /node_modules/,
                loaders: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                postcssPresetEnv()
                            ]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'static' }
        ]),
        new GenerateJsonPlugin('manifest.json',
            require('./manifest.json'),
            null,
            4
        ),
        new HtmlWebPackPlugin({
            template: "./src/static/index.html",
            filename: "index.html",
            excludeAssets: [
                /content.*.js/, // Excluding content scripts
                /background.*.js/ // Excluding background scripts
            ] 
        }),
        new HtmlWebpackExcludeAssetsPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ]
};