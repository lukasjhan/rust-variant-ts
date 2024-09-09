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
