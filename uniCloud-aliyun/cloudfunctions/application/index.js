// application -> index.js
const explain = require('explain');
const path = require('path');
const router = require('./router/router');

exports.main = async (event, context) => {
  return explain.run(event, context, (config) => {
    config.init({
      baseDir: path.resolve(__dirname, 'dist'),
      serviceDir: '/controller/'
    });

    config.route.add(router);

    config.filter.add([
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
  });
};
