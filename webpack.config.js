const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProgressPlugin, DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

dotenv.config();

/**
 * @see https://webpack.js.org/configuration/
 * @type {import("webpack").Configuration}
 */
module.exports = (env) => {
  const { mode, analyzer } = env;

  const isDev = mode === 'development';
  const isProd = mode === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    }),
    new DefinePlugin({
      __ENV__: JSON.stringify(mode),
      __API__: JSON.stringify(process.env.API || 'http://localhost:3000/api'),
    }),
  ];

  if (isDev) {
    plugins.push(new ProgressPlugin());
    plugins.push(new ForkTsCheckerWebpackPlugin());
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      }),
    );
  }

  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  /**
   * @see https://webpack.js.org/configuration/dev-server/
   * @type {import('webpack-dev-server').Configuration}
   */
  let devServer;
  if (isDev) {
    devServer = {
      port: 3001,
      historyApiFallback: true,
      hot: true,
      devMiddleware: { writeToDisk: true },
      static: { directory: path.resolve(__dirname, 'public') },
      client: { overlay: true },
    };
  }

  return {
    mode,
    entry: path.resolve(__dirname, 'src', 'app', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: '/',
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/i,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                icon: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'convertColors',
                      params: {
                        currentColor: true,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.module\.(css|scss)$/i,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                [
                  '@babel/preset-react',
                  {
                    runtime: isDev ? 'automatic' : 'classic',
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '~app/*': path.resolve(__dirname, 'src', 'app/*'),
        '~pages/*': path.resolve(__dirname, 'src', 'pages/*'),
        '~widgets/*': path.resolve(__dirname, 'src', 'widgets/*'),
        '~features/*': path.resolve(__dirname, 'src', 'features/*'),
        '~entities/*': path.resolve(__dirname, 'src', 'entities/*'),
        '~shared/*': path.resolve(__dirname, 'src', 'shared/*'),
      },
    },
    devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
    devServer,
  };
};
