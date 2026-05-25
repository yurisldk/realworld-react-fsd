const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const dotenv = require('dotenv');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProgressPlugin, DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

/**
 * @see https://webpack.js.org/configuration/
 * @type {import("webpack").Configuration}
 */
module.exports = (env) => {
  const { analyzer } = env;

  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    }),
    new DefinePlugin({
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      __API_URL__: JSON.stringify(process.env.API_URL),
    }),
  ];

  if (isDev) {
    plugins.push(new ProgressPlugin());
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        issue: {
          exclude: [{ file: '**/src/shared/api/generated/**' }],
        },
      }),
    );
    plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
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
    plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false }));
  }

  /**
   * @see https://webpack.js.org/configuration/dev-server/
   * @type {import('webpack-dev-server').Configuration}
   */
  let devServer;
  if (isDev) {
    devServer = {
      port: process.env.PORT,
      historyApiFallback: true,
      hot: true,
      devMiddleware: { writeToDisk: true },
      static: { directory: path.resolve(__dirname, 'public') },
      client: { overlay: false },
    };
  }

  return {
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, 'src', 'app', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
      chunkFilename: analyzer ? '[name].js' : undefined,
      clean: true,
      publicPath: '/',
    },
    plugins,
    stats: isProd && !analyzer ? 'summary' : 'normal',
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
                    runtime: 'automatic',
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
    devtool: isDev ? 'source-map' : undefined,
    devServer,
    performance: isProd
      ? {
          hints: 'warning',
          maxEntrypointSize: 400000,
          maxAssetSize: 250000,
        }
      : false,
    optimization: {
      chunkIds: analyzer ? 'named' : undefined,
      minimizer: isProd ? ['...', new CssMinimizerPlugin()] : undefined,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          reactVendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 50,
            enforce: true,
          },
          routerVendor: {
            test: /[\\/]node_modules[\\/]react-router[\\/]/,
            name: 'router-vendor',
            chunks: 'all',
            priority: 45,
            enforce: true,
          },
          tanstackVendor: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'tanstack-vendor',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
          commonVendor: {
            test: /[\\/]node_modules[\\/](react-error-boundary|classnames|zod|react-icons)[\\/]/,
            name: 'common-vendor',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
        },
      },
      runtimeChunk: 'single',
    },
  };
};
