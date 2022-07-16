const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
  disableChunk,
} = require('customize-cra')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  // disable source-map
  (config) => {
    // eslint-disable-next-line no-param-reassign
    config.devtool = ''
    return config
  },
  disableChunk(),
  addLessLoader(),
  addWebpackPlugin(new MonacoWebpackPlugin({
    languages: ['json'],
  })),
)
