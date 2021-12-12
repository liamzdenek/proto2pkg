var path = require('path');

module.exports = {
    entry: ['regenerator-runtime/runtime.js', './src/index.ts'],
    target: "node",
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'] //resolve all the modules other than index.ts
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.ts?$/
            },
        ]
    },
}
