import transform from "@/functions/transform.function";
import { Chance } from "chance";

const chance = new Chance();

describe("function: transform", () => {
  class User {
    id: number;
    name: string;
    age: number;
  }

  const users = Array.from({ length: 10 }).map(() => ({
    id: chance.natural(),
    name: chance.name(),
    age: chance.age()
  }));

  it("should pass data without transforming if Model is not defined", () => {
    const transformedUser = transform(users[0]);
    expect(transformedUser).toEqual(transformedUser);
  });

  it("should transform data to an instance of Model if provided", () => {
    const transformedUser = transform(users[0], User);
    expect(transformedUser).toBeInstanceOf(User);
  });

  it("should transform data to an array of Model instances if data is an array and Model is wrapped in an array", () => {
    const transformedUsers = transform(users, [User]);
    transformedUsers.forEach((user) => expect(user).toBeInstanceOf(User));
  });

  it("should throw an error if there is a mismatch between data and Model arrays", () => {
    expect(() => transform(users[0], [User])).toThrow();
    expect(() => transform(users, User)).toThrow();
  });

  it("should throw an error if Model is wrapped in an array and does not contain exactly one class", () => {
    expect(() => transform(users, [User, User])).toThrow();
    expect(() => transform(users, [])).toThrow();
  });
});
