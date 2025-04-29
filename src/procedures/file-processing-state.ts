
export class FileProcessingState {
  /** Исходное содержимое файла */
  originalContent: string;
  /** Текущее содержимое после обработки */
  currentContent: string;
  /** Путь к файлу (опционально) */
  filePath?: string;
  /** Статистика обработки (сколько строк удалено, заменено и т.д.) */
  stats: {
    linesRemoved: number;
    linesReplaced: number;
    transformationsApplied: number;
  };

  constructor(content: string, filePath?: string) {
    this.originalContent = content;
    this.currentContent = content;
    this.filePath = filePath;
    this.stats = {
      linesRemoved: 0,
      linesReplaced: 0,
      transformationsApplied: 0,
    };
  }
}