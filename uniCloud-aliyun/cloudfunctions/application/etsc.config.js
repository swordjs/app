module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: true,
    target: "es2015",
  },
  assets: {
    baseDir: "services",
    filePatterns: ["**/*.json"],
  },
};
