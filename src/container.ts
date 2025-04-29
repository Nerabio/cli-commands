import "reflect-metadata";
import { Container } from "inversify";
import  getDecorators  from "inversify-inject-decorators";
import { GreetCommand } from "./commands/greet.command";
import { CommandRegistry } from "./commands/command.registry";
import { ConcreteCommandFactory } from "./commands/command.factory";
import { initializeCommands } from "./commands/command.decorator";

const container = new Container();

container.bind(CommandRegistry).toSelf().inSingletonScope();
container.bind(ConcreteCommandFactory).toSelf();
container.bind(GreetCommand).toSelf();

initializeCommands(container);
const { lazyInject } = getDecorators(container);
export { container, lazyInject };


