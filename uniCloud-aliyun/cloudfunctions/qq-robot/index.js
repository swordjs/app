'use strict';

const explain = require('explain');
const path = require('path');

exports.main = async (event, context) =>
  explain.run({
    event,
    context,
    startup: (app) => {
      app.init({
        baseDir: path.resolve(__dirname, 'dist'),
        serviceDir: '/services/'
      });
      app.route.add([
        {
          route: 'api/group',
          service: 'group',
          routes: [
            {
              route: 'postMessage',
              action: 'postMessage'
            },
            {
              route: 'getSampleQuestionList',
              action: 'getSampleQuestionList',
              httpMethod: 'GET'
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
    }
  });
