declare module 'explain' {
  class service {
    constructor(e: { event: ExplainEvent; context: Context; explain: unknown });
  }
  class filter {
    constructor(e: { event: ExplainEvent; context: Context; explain: unknown });
  }
  class dateTime {
    static now(formatString: string, timezone: string);
  }
  function run(e: { event: ExplainEvent; context: Context; startup: (app) => void });
}
