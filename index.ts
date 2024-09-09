export namespace VariantType {
  export abstract class Variant<
    Tag extends string,
    Shape extends Record<Tag, Record<string, unknown>>
  > {
    abstract readonly tag: Tag;

    match<R>(handlers: { [K in Tag]: (value: Shape[K]) => R }): R {
      const handler = handlers[this.tag];
      return handler(this as any);
    }
  }

  type ResultTag = 'Ok' | 'Err';

  type ResultShape<T, E> = {
    Ok: { value: T };
    Err: { error: E };
  };

  export abstract class Result<T, E> extends Variant<
    ResultTag,
    ResultShape<T, E>
  > {
    static ok<T, E>(value: T): Result<T, E> {
      return new Ok(value);
    }

    static err<T, E>(error: E): Result<T, E> {
      return new Err(error);
    }
  }

  export class Ok<T, E> extends Result<T, E> {
    readonly tag = 'Ok' as const;
    constructor(public readonly value: T) {
      super();
    }
  }

  export class Err<T, E> extends Result<T, E> {
    readonly tag = 'Err' as const;
    constructor(public readonly error: E) {
      super();
    }
  }

  type OptionTag = 'Some' | 'None';

  type OptionShape<T> = {
    Some: { value: T };
    None: {};
  };

  export abstract class Option<T> extends Variant<OptionTag, OptionShape<T>> {
    static some<T>(value: T): Option<T> {
      return new Some(value);
    }

    static none<T>(): Option<T> {
      return new None();
    }

    abstract isSome(): this is Some<T>;
    abstract isNone(): this is None<T>;
    abstract unwrap(): T;
    abstract unwrapOr(defaultValue: T): T;

    map<U>(f: (value: T) => U): Option<U> {
      return this.match({
        Some: ({ value }) => Option.some(f(value)),
        None: () => Option.none(),
      });
    }

    flatMap<U>(f: (value: T) => Option<U>): Option<U> {
      return this.match({
        Some: ({ value }) => f(value),
        None: () => Option.none(),
      });
    }
  }

  export class Some<T> extends Option<T> {
    readonly tag = 'Some' as const;
    constructor(public readonly value: T) {
      super();
    }

    isSome(): this is Some<T> {
      return true;
    }
    isNone(): this is None<T> {
      return false;
    }
    unwrap(): T {
      return this.value;
    }
    unwrapOr(_defaultValue: T): T {
      return this.value;
    }
  }

  export class None<T> extends Option<T> {
    readonly tag = 'None' as const;

    isSome(): this is Some<T> {
      return false;
    }
    isNone(): this is None<T> {
      return true;
    }
    unwrap(): never {
      throw new Error('Cannot unwrap None');
    }
    unwrapOr(defaultValue: T): T {
      return defaultValue;
    }
  }
}

function divide(a: number, b: number): VariantType.Result<number, string> {
  if (b === 0) {
    return VariantType.Result.err('Division by zero');
  }
  return VariantType.Result.ok(a / b);
}

function findEven(numbers: number[]): VariantType.Option<number> {
  const even = numbers.find((n) => n % 2 === 0);
  return even !== undefined
    ? VariantType.Option.some(even)
    : VariantType.Option.none();
}

const results = [divide(10, 2), divide(1, 0), divide(7, 3)];

results.forEach((result) => {
  const message = result.match({
    Ok: ({ value }) => `Result: ${value}`,
    Err: ({ error }) => `Error: ${error}`,
  });
  console.log(message);
});

const numbers = [1, 3, 5, 7, 8, 9];
const evenNumber = findEven(numbers);

const evenMessage = evenNumber.match({
  Some: ({ value }) => `Found even number: ${value}`,
  None: () => 'No even number found',
});

console.log(evenMessage);

// Option의 추가 메서드 사용 예시
console.log('Is Some?', evenNumber.isSome());
console.log('Is None?', evenNumber.isNone());

const unwrappedEven = evenNumber.unwrapOr(0);
console.log('Unwrapped even number (or default):', unwrappedEven);

const doubledEven = evenNumber.map((x) => x * 2);
console.log('Doubled even number:');
doubledEven.match({
  Some: ({ value }) => console.log(value),
  None: () => console.log('No even number to double'),
});

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

class Circle extends Shape {
  readonly tag = 'Circle' as const;
  constructor(public radius: number) {
    super();
  }
}

class Rectangle extends Shape {
  readonly tag = 'Rectangle' as const;
  constructor(public width: number, public height: number) {
    super();
  }
}

class Triangle extends Shape {
  readonly tag = 'Triangle' as const;
  constructor(public base: number, public height: number) {
    super();
  }
}

const shapes: Shape[] = [
  Shape.circle(5),
  Shape.rectangle(4, 6),
  Shape.triangle(3, 4),
];

shapes.forEach((shape) => {
  shape.match({
    Circle: ({ radius }) => {
      console.log(`Circle with radius ${radius}`);
    },
    Rectangle: ({ width, height }) => {
      console.log(`Rectangle with width ${width} and height ${height}`);
    },
    Triangle: ({ base, height }) => {
      console.log(`Triangle with base ${base} and height ${height}`);
    },
  });
});
