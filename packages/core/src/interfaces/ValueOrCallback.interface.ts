export type ValueOrCallback<
  TValue,
  TArgs,
  TValueOnly extends boolean = false
> = TValueOnly extends true ? TValue : TValue | ((args?: TArgs) => TValue);
