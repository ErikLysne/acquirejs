export type OmitFirstArg<TFn> = TFn extends (
  x: any,
  ...args: infer TArgs
) => infer TRet
  ? (...args: TArgs) => TRet
  : never;
