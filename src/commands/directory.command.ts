import { CommandDecorator } from "../decorators/command.decorator";
import { injectable } from "inversify";
import { Command, CommandArgs } from "../interfaces";
import { saveToFactory } from "../utils";
import {
  sourceFilesCollector,
  processFile,
  createChecksum,
  extractImports,
  extractExports,
  removeEmptyLines,
  removeLinesWithWord,
  replaceComments,
  shortFilePath,
} from "../procedures";
import { IsDirectoryRule, Validate } from "../validations";
import { ConfigService, LoggerService } from "../services";

@CommandDecorator({
  name: "dir",
  description:
    "Recursively collects project files from a given directory example: ./src",
})
@injectable()
export class DirectoryCommand implements Command {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {}

  @Validate([new IsDirectoryRule("dirPath")])
  async execute({
    main: { dirPath },
    options,
  }: CommandArgs<{ dirPath: string }>): Promise<void> {
    this.logger.warn(`dir ${dirPath}`);
    const collector = sourceFilesCollector(dirPath, [".ts"], async (state) =>
      processFile(
        state,
        createChecksum(),
        extractImports(),
        extractExports(),
        removeEmptyLines(),
        removeLinesWithWord("TODO"),
        replaceComments(),
        shortFilePath(dirPath)
      )
    );

    const processedFiles = await collector.collect();
    const fileDb =
      options?.db ?? this.configService.getKey("defaultOutputFileName");

    if (!fileDb) {
      console.error("No output filename provided or invalid filename");
      return;
    }

    saveToFactory(processedFiles, fileDb, options?.format);
  }
}
