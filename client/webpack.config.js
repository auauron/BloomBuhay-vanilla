import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve("dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
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
    [
    new webpack.DefinePlugin({
      "process.env.REACT_BACKEND_URL": JSON.stringify(process.env.REACT_BACKEND_URL),
    }),
  ],
  ],
  devServer: {
    port: 5173,
    historyApiFallback: true,
  },
  mode: "development",
};
