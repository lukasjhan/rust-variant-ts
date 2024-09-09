# rust-variant

[![npm version](https://badge.fury.io/js/rust-variant.svg)](https://badge.fury.io/js/rust-variant)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript implementation of Rust's Variant, Result, and Option types. This library provides a robust way to handle algebraic data types, error handling, and optional values in TypeScript, inspired by Rust's powerful type system.

## Features

- **Variant Type**: A TypeScript implementation of Rust's enum-like variants.
- **Result Type**: For error handling, similar to Rust's `Result<T, E>`.
- **Option Type**: For handling optional values, similar to Rust's `Option<T>`.
- **Pattern Matching**: Use the `match` method for elegant pattern matching.
- **Functional Methods**: Includes methods like `map`, `flatMap`, and more for composable operations.

## Installation

Install the package using npm:

```bash
npm install rust-variant
```

Or using yarn:

```bash
yarn add rust-variant
```

Or using pnpm:

```bash
pnpm add rust-variant
```

## Usage

### Importing

```typescript
import { VariantType } from 'rust-variant';
```

### Result Type

Use `Result` for operations that might fail:

```typescript
function divide(a: number, b: number): VariantType.Result<number, string> {
  if (b === 0) {
    return VariantType.Result.err('Division by zero');
  }
  return VariantType.Result.ok(a / b);
}

const result = divide(10, 2);
result.match({
  Ok: ({ value }) => console.log(`Result: ${value}`),
  Err: ({ error }) => console.log(`Error: ${error}`),
});
```

### Option Type

Use `Option` for values that might not exist:

```typescript
function findEven(numbers: number[]): VariantType.Option<number> {
  const even = numbers.find((n) => n % 2 === 0);
  return even !== undefined
    ? VariantType.Option.some(even)
    : VariantType.Option.none();
}

const numbers = [1, 3, 5, 7, 8, 9];
const evenNumber = findEven(numbers);

evenNumber.match({
  Some: ({ value }) => console.log(`Found even number: ${value}`),
  None: () => console.log('No even number found'),
});
```

### Custom Variant Types

Create your own variant types:

```typescript
type ShapeTag = 'Circle' | 'Rectangle' | 'Triangle';

type ShapeShape = {
  Circle: { radius: number };
  Rectangle: { width: number; height: number };
  Triangle: { base: number; height: number };
};

abstract class Shape extends VariantType.Variant<ShapeTag, ShapeShape> {
  static circle(radius: number): Shape {
    return new Circle(radius);
  }

  static rectangle(width: number, height: number): Shape {
    return new Rectangle(width, height);
  }

  static triangle(base: number, height: number): Shape {
    return new Triangle(base, height);
  }
}

// Usage
const shape = Shape.circle(5);
shape.match({
  Circle: ({ radius }) => console.log(`Circle with radius ${radius}`),
  Rectangle: ({ width, height }) =>
    console.log(`Rectangle with width ${width} and height ${height}`),
  Triangle: ({ base, height }) =>
    console.log(`Triangle with base ${base} and height ${height}`),
});
```

## API Reference

### Result<T, E>

- `ok<T, E>(value: T): Result<T, E>`
- `err<T, E>(error: E): Result<T, E>`
- `match<R>(handlers: { Ok: (value: T) => R, Err: (error: E) => R }): R`

### Option<T>

- `some<T>(value: T): Option<T>`
- `none<T>(): Option<T>`
- `match<R>(handlers: { Some: (value: T) => R, None: () => R }): R`
- `isSome(): boolean`
- `isNone(): boolean`
- `unwrap(): T`
- `unwrapOr(defaultValue: T): T`
- `map<U>(f: (value: T) => U): Option<U>`
- `flatMap<U>(f: (value: T) => Option<U>): Option<U>`

### Variant<Tag, Shape>

- `match<R>(handlers: { [K in Tag]: (value: Shape[K]) => R }): R`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Rust's powerful type system and error handling patterns.
- Thanks to the TypeScript community for providing the tools to make this possible.
