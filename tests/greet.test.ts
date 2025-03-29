import { greet } from "../src/utils/greet";

describe("greet", () => {
  it('should return "Hello, World!" when no name is provided', () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it('should return "Hello, John!" when name is "John"', () => {
    expect(greet("John")).toBe("Hello, John!");
  });
});
