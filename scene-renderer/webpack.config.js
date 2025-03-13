const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx', // Changed from index.ts to index.tsx
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/, // Updated to include jsx and tsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(obj|gltf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Three.js WebSocket App with React',
      template: './src/index.html', // We'll create this template
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },
      ],
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
      },
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
        watch: true,
      },
    ],
    compress: true,
    port: 9000,
  },
};