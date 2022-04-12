const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }
    }
  },
  {
    test: /\.(s(a|c)ss)$/,
    use: ["style-loader", "css-loader", "sass-loader"]
  },
  {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"]
  }
];

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "auto"
  },
  module: { rules },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  resolve: {
    alias: {
      Components: path.resolve(__dirname, "src/components"),
      Data: path.resolve(__dirname, "src/data"),
      Domain: path.resolve(__dirname, "src/domain")
    }
  }
};
