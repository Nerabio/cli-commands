import { replaceComments } from "../replace-comments.function";
import { FileProcessingState } from "../file-processing-state";
import { Procedure } from "../processing-result.interface";

describe("replaceComments", () => {
  let procedure: Procedure;

  beforeEach(() => {
    procedure = replaceComments();
  });

  it("should remove single-line comments", () => {
    const inputContent = `const x = 1;
    // This is a comment
    const y = 2;
    // Another comment
    `;
    const expectedContent = `const x = 1;
    const y = 2;
    `;

    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.currentContent).toBe(expectedContent);
    expect(result.state.stats.linesReplaced).toBe(2); // Две строки с // удалены
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });

  it("should remove inline comments", () => {
    const inputContent = `const x = 1; // Inline comment
    const y = 2;// Another inline comment`;

    // Ожидаем результат без комментариев и лишних пробелов
    const expectedContent = `const x = 1;
const y = 2;`;

    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.currentContent).toBe(expectedContent);
    expect(result.state.stats.linesReplaced).toBe(2); // Две строки с inline-комментариями
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });

  it("should remove multi-line comments", () => {
    const inputContent = `const x = 1;
/* This is a
multi-line comment */
const y = 2;
`;
    const expectedContent = `const x = 1;
const y = 2;`;
    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.currentContent).toBe(expectedContent);
    expect(result.state.stats.linesReplaced).toBe(2); // Две строки с /* */
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });

  it("should handle mixed comments", () => {
    const inputContent = `const x = 1; // Inline comment
// Single-line comment
/* Multi-line
comment */
const y = 2;
`;
    const expectedContent = `const x = 1;
const y = 2;`;
    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.currentContent).toBe(expectedContent);
    expect(result.state.stats.linesReplaced).toBe(4); // Одна inline, одна single-line, одна multi-line
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });

  it("should not modify content without comments", () => {
    const inputContent = `const x = 1;
    const y = 2;`;

    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.currentContent).toBe(inputContent);
    expect(result.state.stats.linesReplaced).toBe(0);
    expect(result.state.stats.transformationsApplied).toBe(1); // Трансформация всё равно применяется
    expect(result.shouldBreak).toBe(false);
  });

  it("should preserve originalContent and update stats correctly", () => {
    const inputContent = `const x = 1;
// Comment
`;
    const state = new FileProcessingState(inputContent);
    const result = procedure(state);

    expect(result.state.originalContent).toBe(inputContent); // originalContent не меняется
    expect(result.state.currentContent).toBe(`const x = 1;`);
    expect(result.state.stats.linesReplaced).toBe(1);
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });

  it("should handle empty content", () => {
    const state = new FileProcessingState("");
    const result = procedure(state);

    expect(result.state.currentContent).toBe("");
    expect(result.state.stats.linesReplaced).toBe(0);
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });
});
