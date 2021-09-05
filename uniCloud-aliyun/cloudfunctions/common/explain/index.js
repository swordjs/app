'use strict';
const program = require('./private/program');
module.exports = {
  run: async (r, e, t) => program.startup(r, e, t),
  service: require('./abstracts/service'),
  filter: require('./abstracts/filter'),
  dateTime: require('./public/dateTime'),
  object: require('./public/object')
};
