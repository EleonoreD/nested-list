const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

// webpack on build shell command
var WebpackShellPlugin = require('webpack-shell-plugin');

const outputClientDirectory = 'dist/client';
const outputServerDirectory = 'dist/server';

var clientConfig = {
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputClientDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test:/\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new CleanWebpackPlugin([outputClientDirectory]),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};


var serverConfig = {
  entry: './src/server/index.js',
  output: {
    path: path.join(__dirname, outputServerDirectory),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {presets: ["@babel/preset-env"]}
        }
      }
    ]
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins : [ ]
};


module.exports = (env, argv) => {

  clientConfig.mode = argv.mode;
  serverConfig.mode = argv.mode;

  if( argv.mode === 'development' ) {
    serverConfig.plugins.push( 
      new WebpackShellPlugin({onBuildExit: ['npm run startserver']}) // restart server after build
    );
  }
  
  return [clientConfig, serverConfig]
}

