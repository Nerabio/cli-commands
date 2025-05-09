import "reflect-metadata";
import { Container } from "inversify";
import {
  CommandRegistry,
  ConcreteCommandFactory,
  DirectoryCommand,
  AddFileCommand,
  DumpCommand,
  DiffCommand,
} from "./commands";
import { ConfigService, LoggerService } from "./services";

const container = new Container();

container.bind(LoggerService).toSelf().inSingletonScope();
container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(CommandRegistry).toSelf().inSingletonScope();
container.bind(ConcreteCommandFactory).toSelf();
container.bind(Container).toConstantValue(container);

[DirectoryCommand, AddFileCommand, DumpCommand, DiffCommand].forEach(
  (command) => {
    container.bind(command).toSelf();
    container.get(CommandRegistry).register(command);
  }
);

export { container };
