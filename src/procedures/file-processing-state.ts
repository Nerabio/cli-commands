export class FileProcessingState {
  originalContent: string;
  currentContent: string;
  filePath?: string;
  filePathShort?: string;
  imports?: string[];
  exports?: string[];
  checksum?: string;
  compression?: string;
  stats: {
    linesRemoved: number;
    linesReplaced: number;
    transformationsApplied: number;
  };

  constructor(content: string, filePath?: string) {
    this.originalContent = content;
    this.currentContent = content;
    this.filePath = filePath;
    this.filePathShort = "";
    this.compression = undefined;
    this.stats = {
      linesRemoved: 0,
      linesReplaced: 0,
      transformationsApplied: 0,
    };
  }
}
