import "reflect-metadata";
import { program } from "commander";
import { container } from "./container";
import { ConcreteCommandFactory } from "./commands/core/command.factory";
import { errorHandler } from "./utils/error-handler.function";

const commandFactory = container.get(ConcreteCommandFactory);

program
  .command("dir <dirPath>")
  .description(
    "Recursively collects project files from a given directory example: ./src"
  )
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action((dirPath, options) => {
    const command = commandFactory.createCommand("dir");
    if (command) {
      command.execute([{ dirPath }, options]).catch((err) => errorHandler(err));
    }
  });

program
  .command("add <filePath>")
  .description("Add single file to project JSON")
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action(async (filePath, options) => {
    const command = commandFactory.createCommand("add");
    if (command) {
      await command
        .execute([{ filePath }, options])
        .catch((err) => errorHandler(err));
    }
  });

program
  .command("dump <filePath>")
  .description(
    "Creates a selective dump of the listed files for analyzing specific solutions"
  )
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action(async (filePath, options) => {
    const command = commandFactory.createCommand("dump");
    if (command) {
      await command
        .execute([{ filePath }, options])
        .catch((err) => errorHandler(err));
    }
  });

program.parse(process.argv);
