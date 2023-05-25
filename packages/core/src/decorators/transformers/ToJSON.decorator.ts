import { Transform } from "class-transformer";

export default function ToJSON(): PropertyDecorator {
  return Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  });
}
