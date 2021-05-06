/* eslint-disable */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const TerserWebpackPlugin = require('terser-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/* eslint-enable */

const isDev = process.env.NODE_ENV === 'development';
const isProd = ! isDev;

const port = process.env.PORT ? process.env.PORT : 8088;


module.exports = {

  context: path.resolve(__dirname, 'src'), // корневая папка для проекта. Ее указание упрощает написание путей к файлам js и html.

  entry: {
    main: './ts/index.ts',
  },

  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash].min.js',
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    open: true,
    // hot: true,
    compress: true,
    host: '0.0.0.0', //  If you want your server to be accessible externally, specify
    // it like this. For example, not it's possible to connect the web-app from mobile
    // phone from LAN and even enjoy the hot reload.
    openPage: `http://localhost:${port}`, // is required when the "host" is specified
    port: port,
    disableHostCheck: true // is required for "localtunnel" only
  },

  devtool: isDev ? 'source-map' : false,

  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserWebpackPlugin(),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all'
    }
  },

  resolve: {
    extensions: ['.ts', '.js', '.json', '.scss'], // позволяют не писать указанные расширения файлов при импорте
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // alias for ts are placed in tsconfig.json
      '@scss': path.resolve(__dirname, 'src/scss'), // Даже несмотря на 'context' путь через 'path'. Иначе - на работает.
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    plugins: [
      new TsconfigPathsPlugin()
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      }
    }),

    new MiniCssExtractPlugin(),

    new CleanWebpackPlugin(), // Чистит папку 'dist'

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './favicon.svg',
          to: path.resolve(__dirname, 'dist')
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          'file-loader'
        ]
      },
    ],
  },
};
