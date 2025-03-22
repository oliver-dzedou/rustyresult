import { describe, expect, test, jest } from "@jest/globals";
import { Result } from "..";

describe("Result", () => {
    const okValue = 42;
    const newValue = 100;
    const errorObj = new Error("Test error");

    // Helper functions for transformations.
    const addOne = (x: number): number => x + 1;
    const transformResult = (x: number): Result<number, Error> => Result.Ok<number, Error>(x + 10);
    const errorToString = (err: Error): string => err.message;

    // Create sample Results.
    const okResult = Result.Ok<number, Error>(okValue);
    const errResult = Result.Err<number, Error>(errorObj);

    // ----------------------------
    // Instance Method Tests
    // ----------------------------

    describe("unwrap", () => {
        test("should return value for Ok", () => {
            expect(okResult.unwrap()).toBe(okValue);
        });

        test("should throw error for Err", () => {
            expect(() => errResult.unwrap()).toThrow(
                `Called Result.unwrap() on an Error value: ${errorObj}`
            );
        });
    });

    describe("unwrapOrElse", () => {
        test("should return contained value for Ok", () => {
            const op = jest.fn(() => newValue);
            expect(okResult.unwrapOrElse(op)).toBe(okValue);
            expect(op).not.toHaveBeenCalled();
        });

        test("should return fallback value from callback for Err", () => {
            const op = jest.fn(() => newValue);
            expect(errResult.unwrapOrElse(op)).toBe(newValue);
            expect(op).toHaveBeenCalledWith(errorObj);
        });
    });

    describe("unwrapErr", () => {
        test("should return error for Err", () => {
            expect(errResult.unwrapErr()).toBe(errorObj);
        });

        test("should throw error for Ok", () => {
            expect(() => okResult.unwrapErr()).toThrow(
                `Called Result.unwrapErr() on a non-Error value: Ok`
            );
        });
    });

    describe("unwrapOr", () => {
        test("should return contained value for Ok", () => {
            expect(okResult.unwrapOr(newValue)).toBe(okValue);
        });

        test("should return default value for Err", () => {
            expect(errResult.unwrapOr(newValue)).toBe(newValue);
        });
    });

    describe("unwrapUnchecked", () => {
        test("should return value for Ok", () => {
            expect(okResult.unwrapUnchecked()).toBe(okValue);
        });

        test("should return undefined for Err (unchecked)", () => {
            // Since the Err variant does not define 'value', unwrapUnchecked returns undefined.
            expect(errResult.unwrapUnchecked()).toBeUndefined();
        });
    });

    describe("unwrapErrUnchecked", () => {
        test("should return error for Err", () => {
            expect(errResult.unwrapErrUnchecked()).toBe(errorObj);
        });

        test("should return undefined for Ok", () => {
            expect(okResult.unwrapErrUnchecked()).toBeUndefined();
        });
    });

    describe("expect", () => {
        const customMsg = "Custom panic message";
        test("should return value for Ok", () => {
            expect(okResult.expect(customMsg)).toBe(okValue);
        });

        test("should throw error with custom message for Err", () => {
            expect(() => errResult.expect(customMsg)).toThrow(
                `${customMsg}: ${errorObj}`
            );
        });
    });

    describe("expectErr", () => {
        const customMsg = "Expected an error";
        test("should return error for Err", () => {
            expect(errResult.expectErr(customMsg)).toBe(errorObj);
        });

        test("should throw error with custom message for Ok", () => {
            expect(() => okResult.expectErr(customMsg)).toThrow(
                `${customMsg}: ${okValue}`
            );
        });
    });

    describe("ok", () => {
        test("should return contained value for Ok", () => {
            expect(okResult.ok()).toBe(okValue);
        });

        test("should return null for Err", () => {
            expect(errResult.ok()).toBeNull();
        });
    });

    describe("isOk", () => {
        test("should return true for Ok", () => {
            expect(okResult.isOk()).toBe(true);
        });

        test("should return false for Err", () => {
            expect(errResult.isOk()).toBe(false);
        });
    });

    describe("isOkAnd", () => {
        test("should return true when predicate satisfied for Ok", () => {
            expect(okResult.isOkAnd(x => x === okValue)).toBe(true);
        });

        test("should return false when predicate not satisfied for Ok", () => {
            expect(okResult.isOkAnd(x => x !== okValue)).toBe(false);
        });

        test("should return false for Err regardless of predicate", () => {
            expect(errResult.isOkAnd(() => true)).toBe(false);
        });
    });

    describe("err", () => {
        test("should return null for Ok", () => {
            expect(okResult.err()).toBeNull();
        });

        test("should return contained error for Err", () => {
            expect(errResult.err()).toBe(errorObj);
        });
    });

    describe("isErr", () => {
        test("should return false for Ok", () => {
            expect(okResult.isErr()).toBe(false);
        });

        test("should return true for Err", () => {
            expect(errResult.isErr()).toBe(true);
        });
    });

    describe("isErrAnd", () => {
        test("should return true when predicate is satisfied for Err", () => {
            expect(errResult.isErrAnd(err => err.message === errorObj.message)).toBe(true);
        });

        test("should return false when predicate is not satisfied for Err", () => {
            expect(errResult.isErrAnd(() => false)).toBe(false);
        });

        test("should return false for Ok regardless of predicate", () => {
            expect(okResult.isErrAnd(() => true)).toBe(false);
        });
    });

    describe("or", () => {
        const alternative = Result.Ok<number, Error>(newValue);
        test("should return self when Ok", () => {
            expect(okResult.or(alternative)).toBe(okResult);
        });

        test("should return alternative when self is Err", () => {
            expect(errResult.or(alternative).unwrap()).toBe(newValue);
        });
    });

    describe("orElse", () => {
        const alternativeResult = Result.Ok<number, Error>(newValue);
        test("should return self when Ok", () => {
            const op = jest.fn(() => alternativeResult);
            expect(okResult.orElse(op)).toBe(okResult);
            expect(op).not.toHaveBeenCalled();
        });

        test("should return alternative result from callback when Err", () => {
            const op = jest.fn(() => alternativeResult);
            expect(errResult.orElse(op)).toBe(alternativeResult);
            expect(op).toHaveBeenCalledWith(errorObj);
        });
    });

    describe("and", () => {
        const otherResult = Result.Ok<number, Error>(newValue);
        test("should return other result when self is Ok", () => {
            expect(okResult.and(otherResult)).toBe(otherResult);
        });

        test("should return contained error when self is Err", () => {
            expect(errResult.and(otherResult)).toBe(errorObj);
        });
    });

    describe("andThen", () => {
        test("should apply transform function when Ok", () => {
            const res = okResult.andThen(transformResult);
            // Since transformResult returns a Result, we expect its unwrapped value.
            expect((res as Result<number, Error>).unwrap()).toBe(okValue + 10);
        });

        test("should return contained error when self is Err", () => {
            expect(errResult.andThen(transformResult)).toBe(errorObj);
        });
    });

    describe("map", () => {
        test("should transform the value when Ok", () => {
            const res = okResult.map(addOne);
            expect(res.unwrap()).toBe(okValue + 1);
        });

        test("should preserve Err when mapping over Err", () => {
            const res = errResult.map(addOne);
            expect(() => res.unwrap()).toThrow(
                `Called Result.unwrap() on an Error value: ${errorObj}`
            );
        });
    });

    describe("mapOr", () => {
        test("should apply function when Ok", () => {
            expect(okResult.mapOr(newValue, addOne)).toBe(okValue + 1);
        });

        test("should return default value when Err", () => {
            expect(errResult.mapOr(newValue, addOne)).toBe(newValue);
        });
    });

    describe("mapOrElse", () => {
        test("should apply function when Ok", () => {
            expect(okResult.mapOrElse<string>(errorToString, () => "43")).toBe("43");
        });

        test("should apply defaultOp when Err", () => {
            expect(errResult.mapOrElse(errorToString, addOne.toString)).toBe(errorObj.message);
        });
    });

    describe("mapErr", () => {
        const errorTransform = (err: Error) => `Error: ${err.message}`;
        test("should transform error when Err", () => {
            const res = errResult.mapErr(errorTransform);
            expect(() => res.unwrap()).toThrow(
                `Called Result.unwrap() on an Error value: Error: ${errorObj.message}`
            );
        });
        test("should preserve Ok when mapping error over Ok", () => {
            const res = okResult.mapErr(errorTransform);
            expect(res.unwrap()).toBe(okValue);
        });
    });
});
