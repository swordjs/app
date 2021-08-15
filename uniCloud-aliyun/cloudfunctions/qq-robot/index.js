"use strict";

const explain = require("explain");
const path = require("path");

exports.main = async (event, context) => {
  return explain.run(event, context, (config) => {
    config.init({
      baseDir: path.resolve(__dirname, "dist"),
    });
  });
};
