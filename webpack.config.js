const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");

module.exports = {
    entry: {
        label: "./src/label/index.jsx",
        background: "./src/background_scripts/background.js",
        content: "./src/content_scripts/toggle_label.jsx"
    },
    output: {
        path: `${__dirname}/build`,
        filename: '[name].js'
    },
    module: {
        rules: [
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
        new HtmlWebpackExcludeAssetsPlugin()
    ]
};