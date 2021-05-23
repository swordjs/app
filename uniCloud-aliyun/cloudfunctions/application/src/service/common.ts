namespace CommonService {
  const { formParser } = require("form-data-utils");
  module.exports = class Common {
    public event: any;
    constructor({ event }) {
        this.event = event;
    }
  };
}