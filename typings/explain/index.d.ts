declare module 'explain' {
  class service {
    public event: ExplainCloudEvent;
    public context: CloudContext;
    public explain: unknown;
    constructor(e: { event: ExplainCloudEvent; context: CloudContext; explain: unknown });
  }
  class filter {
    constructor(e: { event: ExplainCloudEvent; context: CloudContext; explain: unknown });
  }
  class dateTime {
    static now(formatString: string, timezone: string);
  }
  function run(e: { event: ExplainCloudEvent; context: CloudContext; startup: (app) => void });
}
