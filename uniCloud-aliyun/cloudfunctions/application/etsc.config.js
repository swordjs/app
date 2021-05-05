module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: true,
    target: "es2015",
  },
  assets: {
    baseDir: "src",
    filePatterns: ["**/*.json"],
  },
};
