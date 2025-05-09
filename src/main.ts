import "reflect-metadata";
import { program } from "commander";
import { executeCommand } from "./utils";
require("dotenv").config();

program
  .command("dir <dirPath>")
  .description(
    "Recursively collects project files from a given directory example: ./src"
  )
  .option("-d, --db [dbName]", "Optional name of db or new")
  .option("-f, --format [formatType]", "Output format: json or txt")
  .action((dirPath, options) => executeCommand("dir", { dirPath }, options));

program
  .command("add <filePath>")
  .description("Add single file to project JSON")
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action((filePath, options) => executeCommand("add", { filePath }, options));

program
  .command("dump <filePath>")
  .description(
    "Creates a selective dump of the listed files for analyzing specific solutions"
  )
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action((filePath, options) => executeCommand("dump", { filePath }, options));

program
  .command("diff <filePath>")
  .description(
    "From the general dump make a new one only for those who have changed"
  )
  .option("-d, --db [dbName]", "Optional name of db or new")
  .action((filePath, options) => executeCommand("diff", { filePath }, options));

program.parse(process.argv);
