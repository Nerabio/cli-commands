import path from "path";
import fs, { constants } from "fs/promises";
import { Command } from "../interfaces";
import { Validate, FileExistsRule, FileExtensionRule } from "../validations";
import {
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  FileProcessingState,
} from "../procedures";
import { saveToJson } from "../utils";
import { injectable } from "inversify";
import { CommandDecorator } from "../decorators/command.decorator";

@CommandDecorator({
  name: "dump",
  description:
    "Creates a selective dump of the listed files for analyzing specific solutions",
})
@injectable()
export class DumpCommand implements Command {
  @Validate([
    new FileExistsRule("filePath"),
    new FileExtensionRule("filePath", [".txt"]),
  ])
  async execute([{ filePath }, options]: [
    { filePath: string },
    { db?: string }
  ]): Promise<void> {
    const fullPathList = path.resolve(filePath);
    const jsonFile = options?.db ?? "src.json";

    const selectedFiles = await this.getSelectedFiles(fullPathList);
    // Проходим по каждому файлу и обрабатываем его
    const processedFiles: FileProcessingState[] = [];
    for (const filePath of selectedFiles) {
      const content = await fs.readFile(filePath, "utf-8");

      // Создание статуса обработки файла
      let state = new FileProcessingState(content, filePath);
      state = processFile(
        state,
        createChecksum(),
        extractImports(),
        extractExports()
      );

      processedFiles.push({
        filePath,
        imports: state.imports,
        exports: state.exports,
        checksum: state.checksum,
        currentContent: state.currentContent,
        originalContent: state.originalContent,
        stats: state.stats,
      });
    }

    // Сохраняем обработанный дамп
    saveToJson(processedFiles, jsonFile);
    console.log("Dump успешно сохранён!");
  }

  private async getSelectedFiles(filePath: string): Promise<string[]> {
    const textList = path.resolve(filePath);
    try {
      await fs.access(textList, constants.R_OK | constants.W_OK);
      return Promise.resolve(
        (await fs.readFile(textList, "utf-8")).split("\n")
      );
    } catch {
      return Promise.resolve([]);
    }
  }
}
