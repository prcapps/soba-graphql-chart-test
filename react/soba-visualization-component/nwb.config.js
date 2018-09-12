module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'SobaVisualization',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    extractCSS: {
      filename: '[name].css'
    }
  }
}
