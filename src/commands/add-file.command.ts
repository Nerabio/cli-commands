import path from "path";
import fs, { constants } from "fs/promises";
import {
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
  FileProcessingState,
} from "../procedures";
import { JsonScheme, Command, CommandArgs } from "../interfaces";
import { FileExistsRule, FileExtensionRule, Validate } from "../validations";
import { injectable } from "inversify";
import { CommandDecorator } from "../decorators/command.decorator";
import { ConfigService } from "../services";

@CommandDecorator({
  name: "add",
  description: "Add single file to project JSON",
})
@injectable()
export class AddFileCommand implements Command {
  constructor(private readonly configService: ConfigService) {}

  @Validate([
    new FileExistsRule("filePath"),
    new FileExtensionRule("filePath", [".ts", ".js"]),
  ])
  async execute({
    main: { filePath },
    options,
  }: CommandArgs<{ filePath: string }>): Promise<void> {
    const fullPath = path.resolve(filePath);
    const jsonFile =
      options?.db ?? this.configService.getKey("defaultOutputFileName");

    const currentData = await this.getProjectData(jsonFile);

    if (
      currentData.some((f: JsonScheme) => path.resolve(f.filePath) === fullPath)
    ) {
      console.log(`File ${filePath} already exists in ${jsonFile}`);
      return;
    }

    const content = await fs.readFile(fullPath, "utf-8");
    let processingState = new FileProcessingState(content, fullPath);

    processingState = processFile(
      processingState,
      createChecksum(),
      extractImports(),
      extractExports(),
      removeEmptyLines(),
      removeLinesWithWord("TODO"),
      replaceComments()
    );

    currentData.push({
      filePath: filePath,
      imports: processingState.imports,
      exports: processingState.exports,
      checksum: processingState.checksum,
      source: content,
    });

    await this.writeFile(jsonFile, currentData);

    console.log(`File ${filePath} successfully added to ${jsonFile}`);
  }

  private async getProjectData(filePath: string): Promise<JsonScheme[]> {
    const projectJsonPath = path.resolve(filePath);
    try {
      console.log(projectJsonPath);
      await fs.access(projectJsonPath, constants.R_OK | constants.W_OK);
      return Promise.resolve(
        JSON.parse(await fs.readFile(projectJsonPath, "utf-8"))
      );
    } catch {
      await this.writeFile(projectJsonPath);
      return Promise.resolve([]);
    }
  }

  private async writeFile(
    filePath: string,
    currentData: JsonScheme[] = []
  ): Promise<void> {
    return await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
  }
}
