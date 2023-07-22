import AcquireError from "@/errors/AcquireError.error";
import type { ClassConstructor } from "@/interfaces/ClassConstructor.interface";
import type { InstanceOrInstanceArray } from "@/interfaces/InstanceOrInstanceArray.interface";
import { ClassTransformOptions, plainToInstance } from "class-transformer";

export default function transform<TModel = unknown>(
  data: unknown,
  Model?: TModel,
  options?: ClassTransformOptions
): InstanceOrInstanceArray<TModel> {
  if (Model == null) {
    return data as InstanceOrInstanceArray<TModel>;
  }

  const isDataArray = Array.isArray(data);
  const isModelConstructorArray = Array.isArray(Model);
  const isValidModelConstructorArray =
    isModelConstructorArray &&
    Model.length === 1 &&
    typeof Model[0] === "function";

  if (isDataArray) {
    if (!isModelConstructorArray) {
      throw new AcquireError(
        "When `Model` is wrapped in an array, `data` must be an array as well"
      );
    }

    if (!isValidModelConstructorArray) {
      throw new AcquireError(
        "When `data` is an array, `Model` must be wrapped in an array and contain a single class"
      );
    }

    return plainToInstance(
      Model[0],
      data,
      options
    ) as InstanceOrInstanceArray<TModel>;
  }

  return plainToInstance(
    Model as ClassConstructor,
    data,
    options
  ) as InstanceOrInstanceArray<TModel>;
}
