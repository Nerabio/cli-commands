import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import {
  CommandRegistry,
  ConcreteCommandFactory,
  DirectoryCommand,
  AddFileCommand,
  DumpCommand,
  initializeCommands,
} from "./commands";
import { ConfigService } from "./services";

const container = new Container();

container.bind(ConfigService).toSelf();
container.bind(CommandRegistry).toSelf().inSingletonScope();
container.bind(ConcreteCommandFactory).toSelf();
container.bind(DirectoryCommand).toSelf();
container.bind(AddFileCommand).toSelf();
container.bind(DumpCommand).toSelf();

initializeCommands(container);
const { lazyInject } = getDecorators(container);
export { container, lazyInject };
