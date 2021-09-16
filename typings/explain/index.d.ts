declare module 'explain' {
  export class service {
    public event: ExplainCloudEvent;
    public context: CloudContext;
    public explain: unknown;
    constructor(e: { event: ExplainCloudEvent; context: CloudContext; explain: unknown });
  }
  export class filter {
    constructor(e: { event: ExplainCloudEvent; context: CloudContext; explain: unknown });
  }
  export class dateTime {
    static now(formatString: string, timezone: string);
  }
  export function run(e: { event: ExplainCloudEvent; context: CloudContext; startup: (app) => void });
}
