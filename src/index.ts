enum ResultType {
    Ok = "Ok",
    Err = "Err"
}

/**
 * Contains the success value
 */
export interface Ok<T> {
    type: ResultType.Ok,
    value: T
}

/**
 * Contains the error value
 */
export interface Err<E> {
    type: ResultType.Err,
    err: E
}

type ResultValue<T, E> = Ok<T> | Err<E>;

/**
 * A Result type representing either a success (Ok) with a value of type T or a failure (Err) with an error of type E.
 */
export class Result<T, E> {
    private resultValue: ResultValue<T, E>;

    private constructor(resultValue: ResultValue<T, E>) {
        this.resultValue = resultValue;
    }

    /**
     * Creates a new Ok Result with the provided value.
     *
     * @param value - The success value to store.
     * @returns A Result representing a successful outcome.
     */
    static Ok<T, E>(value: T): Result<T, E> {
        return new Result<T, E>({ type: ResultType.Ok, value });
    }

    /**
     * Creates a new Err Result with the provided error.
     *
     * @param err - The error to store.
     * @returns A Result representing a failure.
     */
    static Err<T, E>(err: E): Result<T, E> {
        return new Result<T, E>({ type: ResultType.Err, err });
    }

    /**
     * Unwraps the Result, returning the contained value if it is an Ok variant.
     * Otherwise, throws an Error with a message including the contained error.
     *
     * @throws Will throw an error if the Result is an Err variant.
     * @returns The contained value if Ok.
     */
    unwrap(): T {
        if (this.resultValue.type === ResultType.Err) {
            throw new Error(`Called Result.unwrap() on an Error value: ${JSON.stringify(this.resultValue.err)}`);
        }
        return this.resultValue.value;
    }

    /**
     * Unwraps the Result, returning the contained value if it is Ok.
     * If the Result is Err, returns the result of the provided callback which receives the error.
     *
     * @param op - A callback function that receives the error and returns a fallback value.
     * @returns The contained value if Ok, or the fallback value produced by the callback if Err.
     */
    unwrapOrElse(op: (err: E) => T): T {
        if (this.resultValue.type === ResultType.Ok) {
            return this.resultValue.value;
        }
        return op(this.resultValue.err);
    }

    /**
     * Unwraps the Result and returns the contained error if it is an Err variant.
     * Otherwise, throws an Error with a message including the contained value.
     *
     * @throws Will throw an error if the Result is an Ok variant.
     * @returns The contained error if Err.
     */
    unwrapErr(): E {
        if (this.resultValue.type === ResultType.Err) {
            return this.resultValue.err;
        }
        throw new Error(`Called Result.unwrapErr() on an Ok value: ${JSON.stringify(this.resultValue.value)}`);
    }

    /**
     * Unwraps the Result, returning the contained value if it is Ok.
     * Otherwise, returns the provided default value.
     *
     * @param defaultValue - The default value to return if the Result is Err.
     * @returns The contained value if Ok, or the default value if Err.
     */
    unwrapOr(defaultValue: T): T {
        if (this.resultValue.type === ResultType.Err) {
            return defaultValue;
        }
        return this.resultValue.value;
    }

    /**
     * Unwraps the Result without performing any error or type checking.
     * 
     * **Use with caution**: if the Result is Err, this may lead to unexpected behavior.
     *
     * @returns The contained value (or undefined if Err).
     */
    unwrapUnchecked(): T {
        // @ts-expect-error Does not check if resultValue.type is ResultType.Ok before returning resultValue.value
        return this.resultValue.value;
    }

    /**
     * Unwraps the Result's error without performing any error or type checking.
     * 
     * **Use with caution**: if the Result is Ok, this may lead to unexpected behavior.
     *
     * @returns The contained error (or undefined if Ok).
     */
    unwrapErrUnchecked(): E {
        // @ts-expect-error Does not check if resultValue.type is ResultType.Err before returning resultValue.err
        return this.resultValue.err;
    }

    /**
     * Unwraps the Result, returning the contained value if it is Ok.
     * If it is Err, throws an Error with the provided custom message and the contained error.
     *
     * @param msg - Custom message to include if the Result is Err.
     * @throws Will throw an error with the provided message if the Result is Err.
     * @returns The contained value if Ok.
     */
    expect(msg: string): T {
        if (this.resultValue.type === ResultType.Err) {
            throw new Error(`${msg}: ${this.resultValue.err}`);
        }
        return this.resultValue.value;
    }

    /**
     * Unwraps the Result, returning the contained error if it is Err.
     * If it is Ok, throws an Error with the provided custom message and the contained value.
     *
     * @param msg - Custom message to include if the Result is Ok.
     * @throws Will throw an error with the provided message if the Result is Ok.
     * @returns The contained error if Err.
     */
    expectErr(msg: string): E {
        if (this.resultValue.type === ResultType.Err) {
            return this.resultValue.err;
        }
        throw new Error(`${msg}: ${this.resultValue.value}`);
    }

    /**
     * Returns the contained value if the Result is Ok, or null if it is Err.
     *
     * @returns The contained value if Ok, otherwise null.
     */
    ok(): T | null {
        if (this.resultValue.type === ResultType.Err) {
            return null;
        }
        return this.resultValue.value;
    }

    /**
     * Checks if the Result is an Ok variant.
     *
     * @returns True if the Result is Ok, otherwise false.
     */
    isOk(): boolean {
        return this.resultValue.type === ResultType.Ok;
    }

    /**
     * Checks if the Result is Ok and the contained value satisfies the provided predicate.
     *
     * @param predicate - A function to test the contained value.
     * @returns True if the Result is Ok and the value passes the predicate, otherwise false.
     */
    isOkAnd(predicate: (value: T) => boolean): boolean {
        return this.resultValue.type === ResultType.Ok && predicate(this.resultValue.value);
    }

    /**
     * Returns the contained error if the Result is Err, or null if it is Ok.
     *
     * @returns The contained error if Err, otherwise null.
     */
    err(): E | null {
        if (this.resultValue.type === ResultType.Err) {
            return this.resultValue.err;
        }
        return null;
    }

    /**
     * Checks if the Result is an Err variant.
     *
     * @returns True if the Result is Err, otherwise false.
     */
    isErr(): boolean {
        return this.resultValue.type === ResultType.Err;
    }

    /**
     * Checks if the Result is Err and the contained error satisfies the provided predicate.
     *
     * @param predicate - A function to test the contained error.
     * @returns True if the Result is Err and the error passes the predicate, otherwise false.
     */
    isErrAnd(predicate: (err: E) => boolean): boolean {
        return this.resultValue.type === ResultType.Err && predicate(this.resultValue.err);
    }

    /**
     * Returns the current Result if it is Ok, or a provided default Result if it is Err.
     *
     * @param res - A default Result to return if the current Result is Err.
     * @returns The current Result if Ok, otherwise the provided default Result.
     */
    or(res: Result<T, E>): Result<T, E> {
        if (this.resultValue.type === ResultType.Err) {
            return res;
        }
        return this;
    }

    /**
     * Returns the current Result if it is Ok, or the Result returned by a callback if it is Err.
     *
     * @param op - A callback function that receives the error and returns an alternative Result.
     * @returns The current Result if Ok, otherwise the alternative Result produced by the callback.
     */
    orElse(op: (error: E) => Result<T, E>): Result<T, E> {
        if (this.resultValue.type === ResultType.Err) {
            return op(this.resultValue.err);
        }
        return this;
    }

    /**
     * If the Result is Ok, returns the provided Result.
     * If the Result is Err, returns the contained Err.
     *
     * @param res - A Result to return if the current Result is Ok.
     * @returns The provided Result if the current Result is Ok, or the contained error if Err.
     */
    and<U>(res: Result<U, E>): Result<U, E> {
        if (this.resultValue.type === ResultType.Err) {
            return this as unknown as Result<U, E>;
        }
        return res;
    }

    /**
     * If the Result is Ok, calls the provided function with the contained value and returns its Result.
     * If the Result is Err, returns the contained Err.
     *
     * @param op - A function that takes the contained value and returns an alternative Result.
     * @returns The Result returned by the callback if Ok, or the contained error if Err.
     */
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E> {
        if (this.resultValue.type === ResultType.Err) {
            return this as unknown as Result<U, E>
        }
        return op(this.resultValue.value);
    }

    /**
     * Transforms an Ok value by applying the provided function to it.
     * If the Result is Err, it is left unchanged.
     *
     * @param op - A function that transforms the contained value.
     * @returns A new Result containing the transformed value if Ok, or the original Err.
     */
    map<U>(op: (value: T) => U): Result<U, E> {
        if (this.resultValue.type === ResultType.Err) {
            return this as unknown as Result<U, E>;
        }
        return Result.Ok<U, E>(op(this.resultValue.value));
    }

    /**
     * Maps an Ok value using the provided function, or returns a default value if the Result is Err.
     *
     * @param defaultValue - The default value to return if the Result is Err.
     * @param op - A function that transforms the contained value.
     * @returns The transformed value if Ok, or the default value if Err.
     */
    mapOr<U>(defaultValue: U, op: (value: T) => U): U {
        if (this.resultValue.type === ResultType.Err) {
            return defaultValue;
        }
        return op(this.resultValue.value);
    }

    /**
     * Maps an Ok value using the provided function, or computes a default value using a callback if the Result is Err.
     *
     * @param defaultOp - A function that computes a default value from the contained error.
     * @param op - A function that transforms the contained value.
     * @returns The transformed value if Ok, or the computed default value if Err.
     */
    mapOrElse<U>(defaultOp: (err: E) => U, op: (value: T) => U): U {
        if (this.resultValue.type === ResultType.Err) {
            return defaultOp(this.resultValue.err);
        }
        return op(this.resultValue.value);
    }

    /**
     * Transforms an Err value by applying the provided function to it.
     * If the Result is Ok, it is left unchanged.
     *
     * @param op - A function that transforms the contained error.
     * @returns A new Result with the transformed error if Err, or the original Ok.
     */
    mapErr<F>(op: (err: E) => F): Result<T, F> {
        if (this.resultValue.type === ResultType.Err) {
            return Result.Err<T, F>(op(this.resultValue.err));
        }
        return this as unknown as Result<T, F>;
    }
}
