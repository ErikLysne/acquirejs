import type { ClassConstructor } from "./ClassConstructor.interface";

export type InstanceOrInstanceArray<TTransformTarget> =
  TTransformTarget extends ClassConstructor
    ? InstanceType<TTransformTarget>
    : TTransformTarget extends [classConstructor: ClassConstructor]
    ? InstanceType<TTransformTarget[0]>[]
    : TTransformTarget;
