import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
devServer: {
  port: 5173,
  historyApiFallback: true,
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  ]
},
mode: "development"
};
