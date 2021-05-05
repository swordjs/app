namespace CommonService {
  const { formParser } = require("form-data-utils");
  module.exports = class Common {
    public event: any;
    constructor({ event }) {
        this.event = event;
    }
    uploadFile() {
      const file = formParser(this.event).file;
      return uniCloud.uploadFile({
        cloudPath: file.filename,
        fileContent: file.fileContent,
      });
    }
  };
}