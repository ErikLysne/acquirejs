import type { ClassConstructor } from "./ClassConstructor.interface";

export type InstanceOrInstanceArray<TTarget> = TTarget extends ClassConstructor
  ? InstanceType<TTarget>
  : TTarget extends [classConstructor: ClassConstructor]
  ? InstanceType<TTarget[0]>[]
  : TTarget;
