# rustyresult

This package (almost) reimplements ``std::result`` from ``Rust`` in ``TypeScript`` (with 0 dependencies)

## Use cases

A) You are already familiar with Rust and wish that Typescript had similarly robust and ergonomic error handling <br/>

**This package is for you** <br/>

B) You are not familiar with Rust but wish that Typescript had more robust and ergonomic error handling <br/>

**This package is for you** <br/>

## Installation

**NPM**

``npm install rustyresult``

**Yarn**

``yarn add rustyresult``

## Example usage
```
// YourAxiosWrapper.ts
import { Result } from "rustyresult";
import axios from 'axios';

export class YourAxiosWrapper {
    static async get<T>(url: string): Promise<Result<T, Error>> {
        try {
            const response = await axios.get(url);
            return Result.Ok(response);
        } catch (error) {
            return error instanceof Error ? Result.Err(error) : Result.Err(new Error("Unexpected error"));
        }
    }
}

// UserApi.ts
import { YourAxiosWrapper } from "YourAxiosWrapper";
class UserApi {
    async getUser(userId: string) {
        const user = await YourAxiosWrapper.get("https://someapi.com/user/" + userId);
        // Consumer is now **forced** to deal with the possibility of an error unlike when an error is thrown 
        // And no try/catch is needed! :)
        // For example:
        return user.unwrapOr(defaultUser);
    }
}
```

## Documentation

Everything is documented with JSDoc. Have a look at the [source file](./src/index.ts) or install the package and hover over the symbols <br/> 

If you are not familiar with it yet, I also recommend reading the [official docs](https://doc.rust-lang.org/std/result/) for ``std::Result`` 


## Contributions

Contributors are much appreciated. Whether you spot a bug or have an idea to improve the code, please open an issue and I will take a look ASAP. 
