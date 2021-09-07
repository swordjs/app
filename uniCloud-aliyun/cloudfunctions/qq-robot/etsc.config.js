module.exports = {
  outDir: './dist',
  esbuild: {
    target: 'es2015'
  },
  assets: {
    baseDir: 'src',
    filePatterns: ['**/*.json']
  }
};
