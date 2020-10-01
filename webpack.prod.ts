import * as path from 'path';
import * as webpack from 'webpack';
import * as HtmlWebPackPlugin from 'html-webpack-plugin';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  entry: [
    path.resolve(__dirname, 'src/index.tsx'),
    '@babel/polyfill',
    'react-hot-loader/patch',
    path.resolve(__dirname, 'src/index.scss'),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.sass', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /src\/index\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /src\/components\/.*\.s[ac]ss$/i,
        use: [
          'to-string-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.join(path.dirname(module.filename), 'node_modules'),
                ],
              },
            },
          },
        ],
      },
      { test: /\.pug$/, loader: 'pug-loader' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/index.pug'),
      filename: 'index.html',
      title: 'Scavenger Hunt',
      inject: false,
      cache: false,
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
};

export default config;
