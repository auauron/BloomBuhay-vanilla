const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      // File loader for images
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]',
        },
      },
      // TS/TSX loader
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      // CSS loader (Tailwind)
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // Optional: CSS modules for components
      {
        test: /\.module\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { modules: false },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'public/favicon.ico'),
          to: path.resolve(__dirname, 'dist/favicon.ico'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new Dotenv({
      path: `./.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      systemvars: true,
      defaults: true
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_BACKEND_URL': JSON.stringify(
        process.env.REACT_BACKEND_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://bloombuhay-vanilla-backend.onrender.com' 
          : 'http://localhost:3000')
      ),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  devServer: {
    port: 5173,
    historyApiFallback: true,
  },
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};
