import { ConcreteCommandFactory } from "../commands";
import { container } from "../container";
import { errorHandler } from "./error-handler.function";
import { CommandArgument } from "../interfaces";

const commandFactory = container.get(ConcreteCommandFactory);

export const executeCommand = async (
  commandName: string,
  arg: CommandArgument,
  options: CommandArgument
) => {
  const command = commandFactory.createCommand(commandName);
  if (command) {
    command.execute([arg, options]).catch((err) => errorHandler(err));
  }
};
