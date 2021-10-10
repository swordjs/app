'use strict';
const HaizilinFeInterviewPlugin = require('./Haizilin-FeInterview');
exports.main = () => {
  // 作为拉取核心函数，需要一时间执行多个TASK，而且每一个题源都不一定有API提供，所以需要我们进行捕获或者是以其他办法来获取题源。
  // 每一个题源可以作为一个plugin，注册到全局中即可在对的时间去执行，以这个思路去开发拉取函数，可以保证能公共利用的地方（模板，入库等操作）可以很方便，同时也保留了不同题源不同的获取方法。
  return HaizilinFeInterviewPlugin.main()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
