import { describe, it, expect } from 'vitest';
import { VariantType } from './index';

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

describe('VariantType', () => {
  describe('Result', () => {
    it('should handle Ok case', () => {
      const result = VariantType.Result.ok<number, string>(42);
      expect(
        result.match({
          Ok: ({ value }) => value,
          Err: () => 0,
        })
      ).toBe(42);
    });

    it('should handle Err case', () => {
      const result = VariantType.Result.err<number, string>('error');
      expect(
        result.match({
          Ok: ({ value }) => `${value}`,
          Err: ({ error }) => error,
        })
      ).toBe('error');
    });
  });

  describe('Option', () => {
    it('should handle Some case', () => {
      const option = VariantType.Option.some(42);
      expect(option.isSome()).toBe(true);
      expect(option.isNone()).toBe(false);
      expect(option.unwrap()).toBe(42);
      expect(option.unwrapOr(0)).toBe(42);
    });

    it('should handle None case', () => {
      const option = VariantType.Option.none<number>();
      expect(option.isSome()).toBe(false);
      expect(option.isNone()).toBe(true);
      expect(() => option.unwrap()).toThrow('Cannot unwrap None');
      expect(option.unwrapOr(0)).toBe(0);
    });

    it('should map Some value', () => {
      const option = VariantType.Option.some(42);
      const mapped = option.map((x) => x * 2);
      expect(mapped.unwrap()).toBe(84);
    });

    it('should not map None value', () => {
      const option = VariantType.Option.none<number>();
      const mapped = option.map((x) => x * 2);
      expect(mapped.isNone()).toBe(true);
    });

    it('should flatMap Some value to Some', () => {
      const option = VariantType.Option.some(42);
      const flatMapped = option.flatMap((x) => VariantType.Option.some(x * 2));
      expect(flatMapped.isSome()).toBe(true);
      expect(flatMapped.unwrap()).toBe(84);
    });

    it('should flatMap Some value to None', () => {
      const option = VariantType.Option.some(42);
      const flatMapped = option.flatMap((_) => VariantType.Option.none());
      expect(flatMapped.isNone()).toBe(true);
    });

    it('should not flatMap None value', () => {
      const option = VariantType.Option.none<number>();
      const flatMapped = option.flatMap((x) => VariantType.Option.some(x * 2));
      expect(flatMapped.isNone()).toBe(true);
    });
  });

  describe('Shape', () => {
    it('should create and match Circle', () => {
      const shape = Shape.circle(5);
      const result = shape.match({
        Circle: ({ radius }) => `Circle with radius ${radius}`,
        Rectangle: () => '',
        Triangle: () => '',
      });
      expect(result).toBe('Circle with radius 5');
    });

    it('should create and match Rectangle', () => {
      const shape = Shape.rectangle(4, 6);
      const result = shape.match({
        Circle: () => '',
        Rectangle: ({ width, height }) =>
          `Rectangle with width ${width} and height ${height}`,
        Triangle: () => '',
      });
      expect(result).toBe('Rectangle with width 4 and height 6');
    });

    it('should create and match Triangle', () => {
      const shape = Shape.triangle(3, 4);
      const result = shape.match({
        Circle: () => '',
        Rectangle: () => '',
        Triangle: ({ base, height }) =>
          `Triangle with base ${base} and height ${height}`,
      });
      expect(result).toBe('Triangle with base 3 and height 4');
    });

    it('should handle different shapes in an array', () => {
      const shapes: Shape[] = [
        Shape.circle(5),
        Shape.rectangle(4, 6),
        Shape.triangle(3, 4),
      ];

      const results = shapes.map((shape) =>
        shape.match({
          Circle: ({ radius }) => `Circle: ${Math.PI * radius * radius}`,
          Rectangle: ({ width, height }) => `Rectangle: ${width * height}`,
          Triangle: ({ base, height }) => `Triangle: ${0.5 * base * height}`,
        })
      );

      expect(results).toEqual([
        'Circle: 78.53981633974483',
        'Rectangle: 24',
        'Triangle: 6',
      ]);
    });
  });
});
