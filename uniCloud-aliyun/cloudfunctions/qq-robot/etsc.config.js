module.exports = {
  outDir: "./dist/services",
  esbuild: {
    minify: true,
    target: "es2015",
  },
  assets: {
    baseDir: "src",
    filePatterns: ["**/*.json"],
  },
};