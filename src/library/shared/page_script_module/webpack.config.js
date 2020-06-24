var path = require('path');

module.exports = {
    entry: {
        page_script_module: "./src/index.js",
        test_module: "./tests/ConfigGeneratorTests.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    optimization:{
        minimize: false,
    }
};