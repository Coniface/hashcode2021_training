const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  plugins: [new webpack.ProgressPlugin()],
  devtool: false,
  target: 'node',

  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'src')],
      exclude: [/node_modules/],
    }],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      buffer: false,
      fs: false,
      http: false,
      https: false,
      os: false,
      path: false,
      util: false,
      zlib: false,
    },
  },
}