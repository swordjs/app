const BOUNDARY_REG = /^multipart\/.+?(?:;\s*boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i,
  LEADING_REG = /Content-Disposition:\sform-data;\sname="(.+?)"(?:;\sfilename="(.+?)")?/i,
  TYPE_REG = /Content-Type:\s(.+?)$/i,
  lineBreak = '\r\n';

function split(buf, subBuf) {
  let currentIndex = 0,
    lastIndex = 0,
    bufArr = [];
  while ((lastIndex = buf.indexOf(subBuf, currentIndex)) !== -1) {
    bufArr.push(buf.slice(currentIndex, lastIndex));
    currentIndex = lastIndex + subBuf.length;
    lastIndex = buf.indexOf(subBuf, currentIndex);
  }
  return bufArr;
}

function readParam(buf) {
  let currentIndex = buf.indexOf(lineBreak) + lineBreak.length,
    lastIndex = currentIndex,
    lastCrlfIndex = buf.lastIndexOf(lineBreak),
    bufArr = [];
  while ((lastIndex = buf.indexOf(lineBreak, currentIndex)) !== -1) {
    bufArr.push(buf.slice(currentIndex, lastIndex));
    currentIndex = lastIndex + lineBreak.length;
    if (bufArr[bufArr.length - 1].length === 0) {
      bufArr.push(buf.slice(currentIndex, lastCrlfIndex));
      break;
    }
  }
  return bufArr;
}

module.exports = (event) => {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  const matchedBoundary = contentType.match(BOUNDARY_REG);
  const boundary = matchedBoundary[1] || matchedBoundary[2];
  const body = Buffer.from(event.body, 'base64');

  const paramsArr = split(body, Buffer.from(`--${boundary}`))
    .map((item) => {
      return readParam(item).filter((bufItem) => {
        return bufItem.length > 0;
      });
    })
    .filter((item) => {
      return item.length === 2 || item.length === 3 || item.length === 4;
    })
    .map((item) => {
      const result = {};
      const leadingMatched = item[0].toString().match(LEADING_REG);
      result.name = decodeURIComponent(leadingMatched[1]);
      switch (item.length) {
        case 2:
          result.value = item[1].toString();
          break;
        case 3:
          result.filename = decodeURIComponent(leadingMatched[2]);
          result.contentType = item[1].toString().match(TYPE_REG)[1];
          result.fileContent = item[2];
          break;
        case 4:
          result.filename = decodeURIComponent(leadingMatched[2]);
          result.contentType = item[1].toString().match(TYPE_REG)[1];
          result.fileContent = item[3];
          break;
        default:
          break;
      }
      return result;
    });

  const params = {};
  paramsArr.forEach((item) => {
    const name = item.name;
    delete item.name;
    params[name] = item.fileContent ? item : item.value;
  });

  return params;
};
