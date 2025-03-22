# rustyresult

This package reimplements ``std::result`` from ``Rust`` in ``TypeScript`` (with 0 dependencies)

## Why?

If you appreciate ``Rust``’s ergonomic and robust error handling paradigm, you’ll find ``rustyresult`` a valuable addition to your ``TypeScript`` projects.

Experience the benefits of ``Rust``-like error handling in your TypeScript development today with ``rustyresult``

For an introduction to ``Rust``’s error handling concepts, please refer to the [Rust by Example Error Handling Guide](https://doc.rust-lang.org/rust-by-example/error.html).


## Installation

**NPM**

``npm install rustyresult``

**Yarn**

``yarn add rustyresult``

## Example usage

### Inline
```
const result = await Result.fromPromise<User>(axios.get(`https://www.api.com/users${userId}`));
const user = result.expect("Unknown user");
// Do things with user
// No try catch!!
```

### As a return type
```
class Api {
    async getUser(userId: string): Promise<Result<User>> {
        return Result.fromAsync<User>(async (url: string) => axios.get(url), `https://www.api.com/users${userId}`);
    }
}

const getUser = async (userId: string) => {
    const api = new Api();

    const userResult: Result<User> = await api.getUser(userId);
    const user: User = userResult.unwrapOr(defaultUser);

    // Do stuff with user
    // No try/catch!! :)
}
```

### Matching value

```
const result = await Result.fromPromise<User>(axios.get(`https://www.api.com/users${userId}`));

if (result.err()) {
    console.log("An error occurred while fetching user");
    return null;
}
if (result.ok()) {
   return result.ok(); 
}

```
TODO
### Chaining results

```
class Api {
    async getUser(userId: string): Promise<Result<User>> {
        return Result.fromAsync<User>(async (url: string) => axios.get(url), `https://www.api.com/users${userId}`);
    }
}

class Db {
    async getUser(userId: string): Promise<Result<User>> {
        return Result.fromPromise<User>(dbClient.query(/* some SQL */));
    }
}

const getUser = async (userId: string) => {
    const api = new Api();
    const db = new Db();

    const userResult = await api.getUser(userId).or()

    // Do stuff with user
    // No try/catch!! :)
}
```

## Full documentation

Everything is documented with JSDoc. Have a look at the [source file](./src/index.ts) or install the package and hover over the symbols
