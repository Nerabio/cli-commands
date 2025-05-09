export interface CommandArgs<T = any> {
  main: T;
  options: {
    db?: string;
    format?: "json" | "txt";
  };
}
