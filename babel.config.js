module.exports = {
  presets: [
    ["env",{ targets: { 'chrome': '60' } }],
    ['@babel/preset-env', { targets: { 'chrome': '60' } }],
    '@babel/preset-typescript'
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    }
  }
}
