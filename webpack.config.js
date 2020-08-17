const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
<<<<<<< HEAD
=======
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
>>>>>>> 27ed1fa906359ff1c6a0b7658fb2ae0a667a663f

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
<<<<<<< HEAD
    publicPath: '/dist/',
    filename: 'bundle.js',
=======
    filename: 'bundle.js'
>>>>>>> 27ed1fa906359ff1c6a0b7658fb2ae0a667a663f
  },
  devtool: 'eval-source-map',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /.(css|scss)$/,
        // include: [path.resolve(__dirname, '/node_modules/react-datepicker/'), path.resolve(__dirname, '/node_modules/bootstrap/')],
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            // loads files as base64 encoded data url if image file is less than set limit
            loader: 'url-loader',
            options: {
              // if file is greater than the limit (bytes), file-loader is used as fallback
              limit: 8192,
            },
          },
        ],
      },
    ]
  },
  devServer: {
<<<<<<< HEAD
=======
    port: 8080,
>>>>>>> 27ed1fa906359ff1c6a0b7658fb2ae0a667a663f
    // contentBase: path.resolve(__dirname, '/dist'),
    // publicPath: '/dist/',
    proxy: {
      '/api/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/assets/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
    new MiniCssExtractPlugin() 
  ],
};
