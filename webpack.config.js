const path = require('path');
const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin-next')

module.exports = {
    entry: ['regenerator-runtime/runtime.js', './src/index.ts'],
    target: "node",
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'proto2pkg'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'], //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.ts?$/
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),

        new WebpackShellPlugin({
            onBuildEnd:{
                scripts: ['chmod +x build/proto2pkg'],
                blocking: true,
                parallel: false,
            },
        }),
    ]
}
