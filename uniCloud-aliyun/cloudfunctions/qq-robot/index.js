'use strict';

const explain = require('explain');
const path = require('path');

exports.main = async (event, context) => {
  return explain.run(event, context, (config) => {
    config.init({
      baseDir: path.resolve(__dirname, 'dist'),
      serviceDir: '/services/'
    });
    config.route.add([
      {
        route: 'api/group',
        service: 'group',
        routes: [
          {
            route: 'postMessage',
            action: 'postMessage'
          }
        ]
      },
      {
        route: 'api/callback',
        service: 'callback',
        routes: [
          {
            route: 'main',
            httpMethod: 'POST',
            action: 'main'
          }
        ]
      }
    ]);
  });
};
