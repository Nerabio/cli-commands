import fs from "fs/promises";
import path from "path";
import { constants } from "fs";
import { FileProcessingState, Procedure } from "../procedures";
// Тип для функции обработки файла
type FileProcessor = (
  state: FileProcessingState
) => Promise<FileProcessingState>;

export const sourceFilesCollector = (
  baseDir: string,
  extensions: string[] = [".txt", ".md", ".json", ".ts", ".js"],
  fileProcessor?: FileProcessor
) => {
  const scanDirectory = async (
    currentDir: string
  ): Promise<FileProcessingState[]> => {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      const results = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            return scanDirectory(fullPath);
          }

          if (
            entry.isFile() &&
            extensions.includes(path.extname(entry.name).toLowerCase())
          ) {
            try {
              await fs.access(fullPath, constants.R_OK);
              const content = await fs.readFile(fullPath, "utf-8");
              let state = new FileProcessingState(content, fullPath);

              // Применяем обработчик если он предоставлен
              if (fileProcessor) {
                state = await fileProcessor(state);
              }

              return [state];
            } catch (error) {
              console.warn(`Skipping unreadable file: ${fullPath}`);
              return [];
            }
          }

          return [];
        })
      );

      return results.flat();
    } catch (error) {
      console.warn(`Error reading directory ${currentDir}: ${error}`);
      return [];
    }
  };

  return {
    collect: async () => scanDirectory(path.normalize(baseDir)),

    // Хелпер для преобразования в процедуры
    toProcedures: (states: FileProcessingState[]): Procedure[] =>
      states.map((state) => (inputState: FileProcessingState) => ({
        state: inputState.filePath === state.filePath ? state : inputState,
        shouldBreak: false,
      })),
  };
};
