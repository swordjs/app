// application -> index.js
const explain = require('explain');
const path = require('path');
const router = require('./router/router');

exports.main = async (event, context) =>
  explain.run({
    event,
    context,
    startup: (app) => {
      app.init({
        baseDir: path.resolve(__dirname, 'dist'),
        serviceDir: '/controller/'
      });
      app.filter.add([
        {
          filter: require('./filters/tokenFilter'),
          ignore: [
            {
              service: 'user',
              actions: ['checkToken', 'loginByWechat', 'getUserContentByID', 'sendSms', 'loginByQQ', 'loginBySms']
            },
            {
              service: 'question',
              actions: ['addPageView']
            },
            {
              service: 'search',
              actions: ['addSeachLog']
            }
          ]
        }
      ]);
      app.route.add(router);
    }
  });
