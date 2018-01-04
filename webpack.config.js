const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const srcDir = './lib/';
const destDir = path.resolve(__dirname + '/dist/');

module.exports = {
    entry: {
        "es6-menu-aim": srcDir+"es6-menu-aim.ts",
    },
    output: {
        path: destDir,
        filename: 'es6-menu-aim.js',
        library: 'es6-menu-aim',
        libraryTarget: 'umd'
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    devtool: 'source-map',

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        },
                    "ts-loader"
                ]
            }
        ]
    },
    externals: {
        'lodash': 'lodash'
    },
    plugins: [
        new CleanWebpackPlugin(destDir)
    ]
};