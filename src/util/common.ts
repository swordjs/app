export const removeHtmlTag = (htmlStr: string): string => {
  return htmlStr.replace(/<[^>]+>/gi, '');
};

// 对象数组去重
export const arrObjectUnique = (arr: unknown[], key: string): unknown[] => {
  const temp = {};
  for (const k in arr) {
    if (arr[k][key] && !temp[arr[k][key]]) {
      temp[arr[k][key]] = arr[k];
    }
  }
  return Object.values(temp);
};

// 数组去重
export const arrUnique = (arr: unknown[]): unknown[] => {
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
export function debounce(fn: () => void, interval: number): () => void {
  const _self = fn;
  let timer = null;
  let first = true;

  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _me = this;
    if (first) {
      first = false;
      _self.apply(_me, args);
    }

    if (timer) {
      clearTimeout(timer);
      // return false;
    }

    timer = setTimeout(function () {
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval);
  };
}
