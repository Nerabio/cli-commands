import "reflect-metadata";
import { Container } from "inversify";
import  getDecorators  from "inversify-inject-decorators";
import { GreetCommand } from "./commands/greet.command";
import { CommandRegistry } from "./commands/command.registry";
import { ConcreteCommandFactory } from "./commands/command.factory";

const container = new Container();

container.bind(CommandRegistry).toSelf().inSingletonScope();
container.bind(ConcreteCommandFactory).toSelf();
container.bind(GreetCommand).toSelf();

const { lazyInject } = getDecorators(container);

export { container, lazyInject };


