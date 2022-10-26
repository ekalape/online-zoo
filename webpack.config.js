const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ghpages = require('gh-pages');

const fs = require('fs');

const header = fs.readFileSync(__dirname + '/src/pages/header.html');
const footer = fs.readFileSync(__dirname + '/src/pages/footer.html');

const devServer = (isDev) =>
  !isDev
    ? {}
    : {
        devServer: {
          open: true,
          hot: true,
          port: 5501,
          static: 'src',
        },
      };

ghpages.publish(
  'dist',
  {
    branch: 'online-zoo',
    /*    repo: 'https://github.com/ekalape/online-zoo.git', */
    dest: 'online-zoo',
  },
  function (err) {}
);

module.exports = ({ develop }) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  entry: {
    'pages/main/index': './src/pages/main/index.js',
    'pages/donate/donate': './src/pages/donate/donate-src.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    /* assetModuleFilename: 'assets/[dir]/[name][ext]', */
    assetModuleFilename: (pathData) => {
      let name = '';
      if (pathData.filename.includes('icons')) {
        if (pathData.filename.includes('socials'))
          name = './assets/icons/socials/[name][ext]';
        else if (pathData.filename.includes('avatars'))
          name = './assets/icons/avatars/[name][ext]';
        else name = './assets/icons/[name][ext]';
      }
      if (pathData.filename.includes('images')) {
        if (pathData.filename.includes('gallery'))
          name = 'assets/images/gallery/[name][ext]';
        else name = 'assets/images/[name][ext]';
      }
      return name;
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ca]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {},
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'pages/main/index.html',
      template: './src/pages/main/index.html',
      header: header,
      footer: footer,
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'pages/donate/donate.html',
      template: './src/pages/donate/donate.html',
      header: header,
      footer: footer,
      chunks: ['donate'],
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './src/json-source/animals.json',
          to: './json-source/animals.json',
        },
        {
          from: './src/json-source/testim.json',
          to: './json-source/testim.json',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  ...devServer(develop),
});
