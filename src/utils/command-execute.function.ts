import { ConcreteCommandFactory } from "../commands";
import { container } from "../container";
import { errorHandler } from "./error-handler.function";
import { CommandArgs } from "../interfaces";

type MainArg = { filePath: string } | { dirPath: string };

type OptionsArg = {
  db?: string;
  format?: "json" | "txt";
};

const commandFactory = container.get(ConcreteCommandFactory);

export const executeCommand = async (
  commandName: string,
  main: MainArg,
  options: OptionsArg = {}
) => {
  const command = commandFactory.createCommand(commandName);
  if (command) {
    const commandArgs: CommandArgs<MainArg> = {
      main,
      options,
    };
    command.execute(commandArgs).catch((err) => errorHandler(err));
  }
};
