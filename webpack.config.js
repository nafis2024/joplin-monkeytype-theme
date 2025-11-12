const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/theme.css', to: 'theme.css' },
      ],
    }),
  ],
  externals: {
    'api': 'commonjs api'
  }
});