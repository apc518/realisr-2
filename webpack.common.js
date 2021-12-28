const HtmlWebpackPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")
const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/public/index.html",
      filename: "index.html"
    }),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, ".")
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[fullhash].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  experiments: {
    asyncWebAssembly: true
  },
};