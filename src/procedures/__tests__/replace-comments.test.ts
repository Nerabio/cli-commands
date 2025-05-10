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
    console.log(expectedContent);
    console.log(result.state.currentContent);

    expect(result.state.currentContent).toBe(expectedContent);
    expect(result.state.stats.linesReplaced).toBe(2); // Две строки с // удалены
    expect(result.state.stats.transformationsApplied).toBe(1);
    expect(result.shouldBreak).toBe(false);
  });
});
