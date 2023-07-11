# Motivation

When working with REST API in TypeScript, some common problems usually arise that AcquireJS aims to solve.

## Problems

### 1. Type safety

The first issue typically encountered when working with REST APIs in TypeScript is <i>type safety</i> of the returned data. Let's imagine we are working with an API that returns an array of user objects, where a user object has the following structure:

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "phoneNumber": "+1234567890",
  "role": "admin",
  "isActive": false,
  "lastActiveAt": "2023-05-30T12:00:00Z",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-05-20T12:00:00Z"
}
```

To fetch a list of users, we can implement a `GET` request like this, using the built-in `fetch` method in JavaScript:

```typescript
async function getUsers() {
  const response = await fetch("http://api.example.com");
  const users = await response.json();
  return users;
}
```

The problem with this implementation is that the data returned from `getUsers` lacks a return type. The return type therefore defaults to `any`:

```typescript
const users = await getUsers();
//    ^ type: any
```

We can easily solve this by adding a type to the `users` variable:

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "basic-user" | "admin";
  isActive: boolean;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

async function getUsers() {
  const response = await fetch("http://api.example.com");
  const users: User[] = await response.json();
  return users;
}
```

Now `getUsers` has a return type of `User[]`:

```typescript
const users = await getUsers();
//    ^ type: User[]
```

However we have now introduced another problem. We typed `lastActiveAt`, `createdAt` and `updatedAt` as `Date` objects, when in reality they are <i>date strings</i>. We have therefore lied to TypeScript about the nature of the data we expect from the `json` method. The real problem is that we have mixed up the <i>desired</i> format of the data with the <i>actual</i> format of the data. This leads us to the second problem: <i>data mapping</i>.

### 2. Data mapping

There is no implicit conversion between date strings and `Date` objects when calling the `json` method; the `fetch` method leaves it up to us to get our data into the desired format. This is actually a good thing, as we might not wish to work with native `Date` objects, but rather use a third party library like [Luxon](https://moment.github.io/luxon/#/) or [Moment](https://momentjs.com/) for handling dates.

While the date example illustrates the problem well, it just one of many issues of such nature that arise when working with REST APIs. Here are some other examples:

- Some APIs return numbers as strings, sometimes with thousand or decimal separators not directly parsable by JavaScript. Ideally, these should be mapped to plain numbers.
- Some APIs contain enum values, which are represented as strings or numbers. Ideally, those should be mapped to something similar to an enum, like a TypeScript enum or an `as const` object.
- Some APIs represent boolean values as something other than a JSON boolean, e.g., as `"true"`/`"false"` string values. Ideally, those should be mapped to proper boolean values.
- Some values may represent a measurable quantity, such as a volume, mass or pressure. In these cases, it would be convenient to map the data to some kind of measurement class, so we could have support for selecting a unit system to display all values in (e.g., SI or imperial).
- Some values may be <i>nullable</i> and we need to decide how to handle that. We may wish to assign a default value to `null` values, such as `0`, `false` or `""`, or something like a default enum value.

We have two fundamental choices when fixing the issue outlined above. The first option is to fix it at the type-level, by typing the return type exactly as we receive it (the "raw" data). The second option is to fix it in run-time by mapping the data to our desired format:

1. <b>Fixing the return type</b>

   ```typescript
   interface UserDTO {
     id: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     role: string;
     isActive: boolean;
     lastActiveAt: string;
     createdAt: string;
     updatedAt: string;
   }

   async function getUsers() {
     const response = await fetch("http://api.example.com");
     const users: UserDTO[] = await response.json();
     return users;
   }
   ```

2. <b>Mapping the data</b>:

   ```typescript
   interface UserModel {
     id: number;
     firstName: string;
     lastName: string;
     email: string;
     phoneNumber: string;
     role: "basic-user" | "admin";
     isActive: boolean;
     lastActiveAt: Date;
     createdAt: Date;
     updatedAt: Date;
   }

   async function getUsers() {
     const response = await fetch("http://api.example.com");
     const userDTOs: any[] = await response.json();

     const userModels: UserModel[] = userDTOs.map((user) => ({
       ...user,
       lastActiveAt: Date.parse(user.lastActiveAt),
       createdAt: Date.parse(user.createdAt),
       updatedAt: Date.parse(upser.updatedAt)
     }));
     return userModels;
   }
   ```

Notice that we have introduced two new terms for the user type. In the first example (`UserDTO`), we use the term <i>DTO</i> (data transfer object) to indicate that this is the format of the <i>transferred</i> data, i.e., the raw data. In the second example (`UserModel`), we have used the term <i>model</i> to indicate that this a model of a user object in our application. This terminology is used extensively in AcquireJS.

The first solution is straightforward, but adds a lot of mental strain on the developer. Elsewhere in the application, we would have the burden of having to know that `lastActiveAt` (and the other date values) is a date represented in string format. In order to do any sort of date logic on it, we would likely need to transform it into some kind of Date object first. Essentially, this just moves the problem further into our application.

The second option is more appealing, as the request method provides a natural location in our code base to map raw data to a more pleasent format to work with. However, it has other limitations when it comes to <i>testing</i>.

### 3. Testing

Testing our code is an important part of the development process. However, if we have opted to go for the second option outlined above, we will have a harder time testing code that is tied to the users API. We may have some function or component that requires a `UserModel` as an input. In order to test this code, we could write a `mockUserModel` function that generates a random user object for us and that would work fine. However, later down the line, we might wish to write more elaborate tests that intercept the `getUsers` method at the network level (e.g., using [Mock Service Worker](https://mswjs.io/)), at which point we don't have any typing for the raw data (the `UserDTO` type), so we would have a harder time making sure the mocked data is in the right format. Additionally, we would have a harder time testing the mapping portion of the `getUsers` method for the same reason.

## Solutions
