const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
} = require('customize-cra');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addLessLoader(),
  addWebpackPlugin(new MonacoWebpackPlugin()),
);
