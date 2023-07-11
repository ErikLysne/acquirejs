# AcquireJS

[![CI](https://github.com/ErikLysne/acquire/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ErikLysne/acquire/actions/workflows/main.yml)

> ⚠<fe0f> <b>WARNING:</b> This package is currently under development and might be subject to breaking changes until version 1.0.0 is released.

AcquireJS is a TypeScript library designed to streamline the process of working with REST APIs. The library aims to solve three common pain-points in the data fetching/mutation process:

- 🔒 <b>Type safety</b> - Ensure that data going into and out of your application from external APIs is type safe.

- 🗺️ <b>Data mapping</b> - Decide how data going into and out of your application from external APIs should be mapped, using a declarative approach.

- 🎭 <b>Mocking and testing</b> - Easily mock data and API responses in order to test your code. Mock Data Transfer Objects (DTOs) to write unit tests at the function and component level, mock API calls to write integration tests at the page level or mock API calls with relational data to write End-to-End (E2E) tests at the application level.

> 💡 <b>Tip:</b> Wondering if AcquireJS is right for your project? [Read the motivation](./motivation.md)!

---

## Table of content

- [Installation](#📦-installation)
- [Configuring TypeScript](#⚙️-configuring-typescript)
- [Example usage](#✨-example-usage)
  - [Setting up Acquire](#setting-up-acquire)
  - [Defining DTO and Model classes](#defining-dto-and-model-classes)
  - [Configuring the endpoint](#configuring-the-endpoint)
  - [Caling the request executor](#calling-the-request-executor)
- [Other features](#🔥-other-features)
  - [Using dynamic request arguments](#using-dynamic-request-arguments)
  - [Requests that return arrays](#requests-that-return-arrays)
  - [Mutations](#mutations)
- [Mocking and testing](#🎭-mocking-and-testing)
  - [Using the Mock decorator](#using-the-mock-decorator)
  - [Using the @acquirejs/mocks package](#using-the-acquiremocks-package)
  - [Mocking data with relations using mock interceptors and the mock cache](#mocking-data-with-relations-using-mock-interceptors-and-the-mock-cache)

---

## 📦 Installation

To get started, install the `@acquirejs/core` package and `reflect-metadata`:

Using npm:

```bash
npm install @acquirejs/core reflect-metadata
```

Using yarn:

```bash
yarn add @acquirejs/core reflect-metadata
```

> 💡 <b>Tip:</b> AcquireJS is built on [axios](https://axios-http.com/docs/intro). If you want to specify an axios config, you should also install axios.

---

## ⚙️ Configuring TypeScript

To use AcquireJS, you must tweak some TypeScript settings. In `tsconfig.json`:

```json
{
  "compilerOptions": {
    // Other settings...
    "strictPropertyInitialization": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

You also need to import `reflect-metadata` at the entry-point of your application:

```typescript
import "reflect-metadata";

// Application entry-point...
```

---

## ✨ Example usage

### Setting up AcquireJS

First, create an instance of `Acquire`:

```typescript
// src/api/acquire.ts

import { Acquire } from "@acquirejs/core";

const acquire = new Acquire();
export default acquire;
```

You can also pass in an axios instance as the first argument:

```typescript
// src/api/acquire.ts

import axios from "axios";
import { Acquire } from "@acquirejs/core";

const exampleAxios = axios.create({
  baseURL: "http://api.example.com"
});

const acquire = new Acquire(exampleAxios);
export default acquire;
```

This will allow multiple requests to share the same default settings, like base url and headers.

> 💡 <b>Tip:</b> If you are working with multiple APIs, you typically want to create one `Acquire` instance for each domain, so properties like `baseURL` and `headers` can be configured separately.

### Defining DTO and Model classes

A key concept in AcquireJS is to use two sets of classes for each endpoint: A <b>DTO</b> class and a <b>Model</b> class. The DTO (Data Transfer Object) is a class representing the data as delivered from or to the server. It should only contain JSON primitive values.

Imagine an example endpoint (`http://api.example.com/users/1`) that returns a user JSON response that looks like this:

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

The DTO class should then look like this:

```typescript
// src/api/users/dtos/UserDTO.ts

export default class UserDTO {
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
```

> 🔍 <b>Caveat:</b> Notice how we are preserving values in their JSON primitive representation at this stage, so even though `lastActive`, `createdAt` and `updatedAt` represent dates, we keep them as strings.

A Model class should also be created, which represents the desired format of the data. It may look like this:

```typescript
// src/api/users/models/UserModel.ts

import { Expose, ToDate } from "@acquirejs/core";

export default class UserModel {
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() phoneNumber: string;
  @Expose() role: "basic-user" | "admin";
  @Expose() isActive: boolean;
  @Expose() @ToDate() lastActiveAt: Date;
  @Expose() @ToDate() createdAt: Date;
  @Expose() @ToDate() updatedAt: Date;
}
```

Here, there are a few things to note: First, the `Expose` decorator has been applied to each field of the class. This is because all values on the response object not defined on the `UserModel` with `Expose` will be stripped. This allows fields on the DTO to be omitted from the model (e.g., to clean up the interface) and is only possible by explicitly annotating the values to expose.

> 💡 <b>Tip:</b> The `Expose` decorator comes straight from the [class-transformer](https://github.com/typestack/class-transformer) library, which is bundled with `@acquirejs/core`. All decorators and functions from `class-transformer` can be imported directly from `@acquirejs/core`.

The second thing to note is that the `UserModel` has been configured to automatically transform the date strings to `Date` objects. This is done by both specifying the type of the value as `Date` (for type safety) and adding a `ToDate` transformer decorator (for data mapping). This allows data mapping to be done in a declarative manner.

> 💡 <b>Tip:</b> See the full list of available transformer decorators, as well as how to write your own.

### Configuring the endpoint

The `Acquire` instance is used with the DTO and Model classes to create a request executor function:

```typescript
// src/api/users/userApi.ts

import acquire from "../../acquire.ts";
import UserDTO from "./dtos/UserDTO.ts";
import UserModel from "./models/UserModel.ts";

export const getUser = acquire({
  request: {
    url: "http://api.example.com/users/1"
  },
  responseMapping: {
    DTO: UserDTO,
    Model: UserModel
  }
});
```

> 💡 <b>Tip:</b> If you instantiated `Acquire` using an `axios` instance with a `baseURL` of `http://api.example.com/`, you could instead just set the `path`:
>
> ```typescript
> export const getUser = acquire({
>   request: {
>     path: "/users/1"
>   },
>   responseMapping: {
>     DTO: UserDTO,
>     Model: UserModel
>   }
> });
> ```

### Calling the request executor

The request can now be executed:

```typescript
import { getUser } from "path/to/getUser";

const user = await getUser();

user.model; // type: UserModel (after mapping)
user.dto;, // type: UserDTO (before mapping)
user.response; // type: AxiosResponse
```

Here, `user.model` is typed and mapped according to the `UserModel` class! 🎉

---

## 🔥 Other features

### Using dynamic request arguments

In the previous example, the ID of the user was hard-coded into the url, causing `getUser` to always return the user with ID 1. This was only shown as a simplistic example, but in general, the ID should be passed as an argument to the `getUser` method. This can be done by passing an object with a `userId` key to the `getUser` method. All properties on the `request` object can be set as values or callbacks that take `callArgs` as the argument. The type of `callArgs` can be set by binding `callArgs` to the method using the `withCallArgs` method on the `Acquire` instance:

```typescript
export const getUser = acquire.withCallArgs<{ userId: number }>()({
  request: {
    url: (callArgs) => `http://api.example.com/users/${callArgs?.userId}`
  },
  responseMapping: {
    DTO: UserDTO,
    Model: UserModel
  }
});
```

And calling the method like so:

```typescript
const user = await getUser({ userId: 10 });
```

> 🔍 <b>Caveat:</b> Note that when using `withCallArgs`, the function is curried. Don't forget the additional set of parenthesis!

---

### Requests that return arrays

Endpoints that return lists of items typically return a JSON array response. When working with endpoints that directly return arrays, the DTO and Model can be wrapped in an array:

```typescript
export const getUsers = acquire({
  request: {
    url: "http://api.example.com/users"
  },
  responseMapping: {
    DTO: [UserDTO],
    Model: [UserModel]
  }
});
```

Now, the return type of `getUsers` has `model` typed as a `UserModel[]` and `dto` as `UserDTO[]`.

---

### Mutations

AcquireJS can also perform mutations. In this case, the request `method` can be specified in the `request` argument. Additionally, a `requestMapping` can be provided, similar to the `responseMapping`. In general, the DTO used for queries and mutations may differ. For instance, the `UserDTO` in the previous example has information about the ID of the user, if the user is currently active, as well as when the user was created, last updated and last active. While this information is not included in the body of a `POST` request, it may appear in the response of the request. Hence, separate `CreateUserDTO` and `CreateUserModel` classes can be created to deal with the outgoing data:

```typescript
// src/api/users/dtos/CreateUserDTO.ts

import { Expose } from "@acquirejs/core";

export default class CreateUserDTO {
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() email: string;
  @Expose() phoneNumber: string;
  @Expose() role: string;
}
```

And:

```typescript
// src/api/users/models/CreateUserModel.ts

export default class CreateUserModel {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: "basic-user" | "admin";
}
```

Here, like before, the `CreateUserModel` represents the state of the data within the application, while `CreateUserDTO` is the object sent to the server.

> 🔍 <b>Caveat:</b> Note that since we are doing the mapping process in <b>reverse for outgoing data</b>, we need to put the `Expose` decorators on the DTO class, not the Model class!

Another request executor function can be created for the mutation:

```typescript
// src/api/users/userApi.ts

import acquire from "../../acquire.ts";
import UserDTO from "./dtos/UserDTO.ts";
import CreateUserDTO from "./dtos/CreateUserDTO.ts";
import UserModel from "./models/UserModel.ts";
import CreateUserModel from "./models/CreateUserModel.ts";

export const getUser = acquire(/* From the previous example...*/);

export const createUser = acquire({
  request: {
    url: "http://api.example.com/users",
    method: "POST"
  },
  requestMapping: {
    DTO: CreateUserDTO,
    Model: CreateUserModel
  },
  responseMapping: {
    DTO: UserDTO,
    Model: UserModel
  }
});
```

To pass this data to the `createUser` method, `data` can be set in the argument:

```typescript
const user = await createUser({
  data: {
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@example.com",
    phoneNumber: "+1987654321",
    role: "basic-user"
  }
});
```

By specifying the `CreateUserModel` in the `responseMapping`, the `data` argument automatically gets the type of the `CreateUserModel` class.

> 💡 <b>Tip:</b> Thanks to TypeScript's structural type system (commonly referred to as <i>duck typing</i>), you can pass a plain object that conforms to the `CreateUserModel` class interface to the `createUser` method, instead of creating an actual instance of the class.

## 🎭 Mocking and testing

In the examples above, the `UserDTO` class was always specified, but was not really used for anything. The DTO classes come into play when writing tests. Instead of tediously writing your own mock data generation code, AcquireJS can handle this process for you through use of Mock decorators. When mocking requests, mock data can be generated in one of two ways:

1. <b>ON DEMAND</b> - When mock data is generated on demand, it is created at the time when the request executor function is called and then discarded. This can be useful for simpler test cases, where the mocked data does not have any relation to other data. Mocking data on demand is not idempotent unless the random generator is reset in between each call, so calling the same request executor function multiple times will not yield the same response.

2. <b>FROM MIDDLEWARE</b> - In more complex situations, it may be necessary to mock requests that rely on other existing data. For example, when mocking DTOs that include properties or IDs from other objects that must be pre-defined. In these cases, a mock cache can be configured and pre-filled with data. In addition, middleware can be applied that intercept the request and perform side effects or mutate the response. This is useful when mocking an entire application and consistent IDs are required to make the application behave in a meaningful way. Thankfully, this can usually be achieved with minimal extra code.

> 💡 <b>Tip:</b> To see if a request is executed or mocked, and to see if the mocking is <i>on demand</i> or <i>from interceptors</i>, you can attach a logger to the `Acquire` instance:
>
> ```typescript
> import { Acquire, AcquireRequestLogger } from "@acquirejs/core";
>
> const acquire = new Acquire().use(new AcquireRequestLogger());
>
> export default acquire;
> ```

To get started with mocking, the DTO classes must be updated to include Mock decorators.

### Using the Mock decorator

The `Mock` decorator can be used to hard-code JSON primitive values for the DTO class:

```typescript
import { Mock } from "@acquirejs/core";

export default class UserDTO {
  @Mock(10) id: number;
  @Mock("Jane") firstName: string;
  @Mock("Doe") lastName: string;
  @Mock("janedoe@example.com") email: string;
  // other properties...
}
```

This will pass those values onto the generated mock data. However, all mocked requests would then end up getting the exact same data. It is generally more meaningful to pass a callback to `Mock` that returns a JSON primitive value:

```typescript
import { Mock } from "@acquirejs/core";

export default class UserDTO {
  @Mock(() => 10) id: number;
  @Mock(() => "Jane") firstName: string;
  @Mock(() => "Doe") lastName: string;
  @Mock(() => "janedoe@example.com") email: string;
  // other properties...
}
```

Here, you can use functions that generate randomly generated data and even execute async functions.

> 🔍 <b>Caveat:</b> When are the Mock callbacks actually called?
>
> When annotating the class with Mock decorators with callbacks, the functions are not invoked until the moment when data is generated. Keep this in mind when using Mock decorators to generate random data.

AcquireJS comes with an additional package `@acquirejs/mocks` that exports a large set of decorators that can be used to annotate DTO classes with mock data.

## Using the @acquirejs/mocks package

To get started, install the mocks package:

```bash
npm install @acquirejs/mocks
```

Or

```bash
yarn add @acquirejs/mocks
```

Then, somewhere near the entry point of your application (before any mocks are invoked), call `initAcquireMocks`:

```typescript
import { initAcquireMocks } from "@acquirejs/mocks";

initAcquireMocks();
```

You can then import the required decorators:

```typescript
// src/api/users/dtos/UserDTO.ts

import {
  MockNatural,
  MockFirstName,
  MockLastName,
  MockEmail,
  MockPhone,
  MockPick,
  MockBool,
  MockDate
} from "@acquirejs/mocks";

export default class UserDTO {
  @MockNatural() id: number;
  @MockFirstName() firstName: string;
  @MockLastName() lastName: string;
  @MockEmail() email: string;
  @MockPhone() phoneNumber: string;
  @MockPick(["basic-user", "admin"]) role: string;
  @MockBool() isActive: boolean;
  @MockDate() lastActiveAt: string;
  @MockDate() createdAt: string;
  @MockDate() updatedAt: string;
}
```

> 💡 <b>Tip:</b> `@acquirejs/mocks` is a wrapper around the [Chance](https://chancejs.com/) library. All Mock decorators can be passed the arguments from their Chance counterpart. Some modification has been made to ensure that the decorators return JSON primitive values. For more info about the mock decorators, please refer to the Chance documentation.

> 💡 <b>Tip:</b> You don't need to worry about omitting this code in your production build if you are using a build tool that supports tree-shaking. Instead, you should conditionally call `initAcquireMocks` based on environment variables. If `initAcquireMocks` is never invoked, the Chance library is not imported and all Mock decorators from `@acquirejs/mocks` are replaced with empty function calls.

### Mocking requests

When mocking an AcquireJS request, no actual network request is executed. Instead, a mock function is called to simulate a network request, which is used for testing. When mocking requests, the data is generated by the `Mock` decorators on the DTO class. There are two ways to mock a request:

1. <b>Calling `.mock()` instead of calling the request executor directly:</b>

   ```typescript
   const users = await getUsers.mock();
   ```

   This is mostly useful when writing simple unit tests, but is not that suited for testing components that fetch data, as it requires us to modify how the function is called.

   > 💡 <b>Tip:</b> When calling a request executor function using `.mock()`, you can (in addition to the `callArgs`) provide a `$count` argument, i.e.,
   >
   > ```typescript
   > const users = await getUsers.mock({ $count: 100 });
   > ```
   >
   > This will decide how many objects are returned for functions that return arrays (in this case, 100 mock users are generated). The default count is 10.

2. <b>Enable mocking globally:</b>

   ```typescript
   import acquire from "path/to/acquire";

   acquire.enableMocking();
   // or
   acquire.setMockingEnabled(true);
   ```

   This enables mocking for all request executor functions created by the `Acquire` instance. This allows mocking to be enabled without modifying the code where it runs, e.g., within a page or a component.

### Mocking data with relations using mock interceptors and the mock cache

Although generating mock data on demand is the simplest approach, it is not always a viable option. For instance, when testing an entire application where multiple endpoints are involved and the data returned from the endpoints have relations. This can be achieved using some special Mock decorators: `MockID`, `MockRelationID` and `MockRelationProperty`.

Continuing with the previous example, imagine an another endpoint at `http://api.example.com/posts` that returns blog posts JSON response that looks like this:

```json
{
  "id": 1,
  "title": "Lorem ipsum",
  "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mollis.",
  "createdByUserId": 1,
  "createdByUserFirstName": "John",
  "createdByUserLastName": "Doe",
  "createdAt": "2023-05-25T12:00:00Z"
}
```

Here, `createdByUserId`, `createdByUserFirstName` and `createdByUserLastName` are related to the `/users` endpoint. If both the user and blog post were generated on demand, these values would not be in sync, which could be essential for more sophisticated tests.

To solve this, some additional steps are required. Firstly, the `UserDTO` class must be modified to use the `MockID` decorator:

```typescript
// src/api/users/dtos/UserDTO.ts

import { MockID } from "@acquirejs/core";
import {
  MockFirstName,
  MockLastName,
  MockEmail,
  MockPhone,
  MockPick,
  MockBool,
  MockDate
} from "@acquirejs/mocks";

export default class UserDTO {
  @MockID() id: number; // 👈 update this
  @MockFirstName() firstName: string;
  @MockLastName() lastName: string;
  @MockEmail() email: string;
  @MockPhone() phoneNumber: string;
  @MockPick(["basic-user", "admin"]) role: string;
  @MockBool() isActive: boolean;
  @MockDate() lastActiveAt: string;
  @MockDate() createdAt: string;
  @MockDate() updatedAt: string;
}
```

Previously, the `MockNatural` decorator was used to mock a natural number (positive integer) for the `id` field. By replacing this with `MockID`, AcquireJS is informed that that the `id` field represents the database ID.

> 💡 <b>Tip:</b> If you are working with an API that is using non-numerical IDs and this is important for your testing, you can provide your own ID generator to `MockID`. You may do this in the following way:

> ```typescript
> let userIdHead = 1;
> function generateUserId(): string {
>   return (userIdHead++).toString();
> }
>
> class UserDTO {
>   @MockID(generateUserId) id: string;
> }
> ```
>
> However, it might not actually matter what format the IDs are in if they are only used to reference other data.

Next, create a `PostDTO` class:

```typescript
// src/api/posts/dto/PostDTO.ts

import { MockID, MockRelationID, MockRelationProperty } from "@acquirejs/core";
import { MockSentence, MockParagraph, MockDate } from "@acquirejs/mocks";
import UserDTO from "../../../users/dto/UserDTO.ts";

export default class PostDTO {
  @MockID() id: number;
  @MockSentence() title: string;
  @MockParagraph() body: string;
  @MockRelationID(() => UserDTO) createdByUserId: number;
  @MockRelationProperty(() => UserDTO, "firstName")
  createdByUserFirstName: string;
  @MockRelationProperty(() => UserDTO, "lastName")
  createdByUserLastName: string;
  @MockDate() createdAt: string;
}
```

Notice how `MockRelationID` is used to indicate that the `createdByUserID` represents the ID of the `UserDTO` object. Additionally, `createdByUserFirstName` is configured to be taken from the `firstName` field on the `UserDTO` (and similarly for `createdByUserLastName` and `lastName`).

Now, when a `PostDTO` is mocked, it is guaranteed to have a `createdByUserId` from an existing `UserDTO` and the `createdByUserFirstName` and `createdByUserLastName` will be taken from the same object. By adding these links, the relationship between the `UserDTO` and `PostDTO` classes are enforced, which leads to better consistency when testing.

Next, create a `PostModel` class:

```typescript
// src/api/posts/models/PostModel.ts

import { Expose, ToDate } from "@acquirejs/core";

export default class PostModel {
  @Expose() id: number;
  @Expose() title: string;
  @Expose() body: string;
  @Expose() createdByUserId: number;
  @Expose() createdByUserFirstName: string;
  @Expose() createdByUserLastName: string;
  @Expose() @ToDate() createdAt: Date;
}
```

And finally set up the request executor function:

```typescript
// src/api/posts/postApi.ts

import acquire from "../../acquire.ts";
import PostDTO from "./dtos/PostDTO.ts";
import PostModel from "./models/PostModel.ts";

export const getPosts = acquire.withCallArgs<{
  createdByUserId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: keyof PostDTO;
  sortByDescending?: boolean;
}>()({
  request: {
    url: "http://api.example.com/posts",
    params: (callArgs) => ({
      createdByUserId: callArgs?.createdByUserId,
      page: callArgs?.page,
      pageSize: callArgs?.pageSize,
      sortBy: callArgs?.sortBy,
      sortByDescending: callArgs?.sortByDescending
    })
  },
  responseMapping: {
    DTO: UserDTO,
    Model: UserModel
  }
});
```

Here, it is assumed that the `/posts` endpoint can accept additional parameters which can be used to filter the returned posts.

As the DTOs now have relations, it is necessary to store all the mocked data somewhere so it can be referenced. This is done by adding a mock cache to the `Acquire` instance:

```typescript
// src/api/acquire.ts

import { Acquire, AcquireLogger, AcquireMockCache } from "@acquirejs/core";

const acquire = new Acquire()
  .useMockCache(new AcquireMockCache())
  .use(new AcquireRequestLogger());

export default acquire;
```

Now the mock cache can be pre-filled with data. Because the blog post is referencing users, some users must already be present in the mock cache. You can create a function to populate the cache which should be called before any mocks are invoked, but after calling `initAcquireMocks`:

```typescript
// src/api/populateMockCache.ts

import { mockCache } from "./acquire";
import UserDTO from "./users/dtos/UserDTO";
import PostDTO from "./users/posts/PostDTO";

export default async function populateMockCache() {
  await mockCache.fill(UserDTO, 20);
  await mockCache.fill(PostDTO, 100);
}
```

This will populate the mock cache with 20 randomly generated `UserDTOs` and 100 `PostDTOs`.

> 🔍 <b>Caveat:</b> The order matters! Because `PostDTO` relies on `UserDTO`, the users must be added first.

> 🔍 <b>Caveat:</b> Note that the `mockCache.fill` function is async and needs to be awaited. Under the hood, the generation process is most likely going to be synchronous, so you don't need to worry about parallelizing multiple `mockCache.fill` calls.

The final step is to set up middleware to interceptor the request for the `getPosts` method, which can enforce the query parameters set up in the `callArgs`. This can be done in a separate file:

```typescript
// src/api/posts/postApiMocking.ts

import { getPosts } from "./getPosts.ts";
import PostDTO from "./dtos/PostDTO.ts";

getPosts.useOnMocking(({ response, mockCache, callArgs }) => {
  const { createdByUserId, page, pageSize, sortBy, sortByDescending } =
    callArgs ?? {};

  const dbSimulator = mockCache!.createDatabaseSimulator(PostDTO);

  // Filter data from the cache based on `callArgs`
  const data = dbSimulator
    .filter(
      createdByUserId
        ? (post) => post.createdByUserId === createdByUserId
        : undefined
    )
    .sort(sortBy, sortByDescending ? "desc" : "asc")
    .paginate(page, pageSize, 1)
    .get();

  // Add the data to the response
  response.data = data;

  // Update the header with the total number of posts
  response.headers = {
    ...response.headers,
    ["x-total-count"]: dbSimulator.count()
  };
});
```

> 🔍 <b>Caveat:</b> Here, `useOnMocking` is used to apply this middleware only when `getPosts` is mocked.

> 💡 <b>Tip:</b> Applying the middleware in a separate file and conditionally importing it dynamically based on environment variables is a good way to omit the code from the production build.

As shown above, the `useOnMocking` method accepts a callback which takes an `AcquireContext` argument. The `AcquireContext` contains helpful properties for simulating an API response, such as the `response`, `mockCache`, `callArgs` and others.

The `createDatabaseSimulator` method on `mockCache` returns an `AcquireDatabaseSimulator` with various helper methods to quickly build a query for data in the mock cache or perform CRUD operations.
