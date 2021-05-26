export const removeHtmlTag = (htmlStr: string) => {
  return htmlStr.replace(/<[^>]+>/gi, "");
};
// 数组去重
export const arrUnique = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const curIndex = arr.indexOf(arr[i]);
    const lastIndex = arr.lastIndexOf(arr[i]);
    curIndex != lastIndex && arr.splice(lastIndex, 1);
  }
  return arr;
};
// 节流
// 防抖
/**
 *
 * @param {要执行的函数} fn
 * @param {在操作多长时间后可再执行，第一次立即执行} interval
 */
export function debounce(fn, interval) {
  var _self = fn;
  var timer = null;
  var first = true;

  return function() {
    var args = arguments;
    var _me = this;
    if (first) {
      first = false;
      _self.apply(_me, args);
    }

    if (timer) {
      clearTimeout(timer);
      // return false;
    }

    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval || 200);
  };
}
