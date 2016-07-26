var path = require('path');

module.exports = {
    entry: './src/js/vastChainer.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/')
    },
    devtool: 'source-map',
    devServer:{
        contentBase: 'dist'
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
