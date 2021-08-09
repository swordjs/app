'use strict';

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, (config) => {
		config.init({
			baseDir: __dirname
		});
	});
}