import { Container, inject, injectable } from "inversify";
import { Command, CommandMetadata, CommandFactory } from "../../interfaces";
import { CommandRegistry } from "./command.registry";

@injectable()
export class ConcreteCommandFactory implements CommandFactory {
  constructor(
    @inject(CommandRegistry) private readonly registry: CommandRegistry,
    @inject(Container) private readonly container: Container
  ) {}

  createCommand(commandName: string): Command | null {
    const CommandConstructor = this.registry.get(commandName);
    if (CommandConstructor) {
      return this.container.get(CommandConstructor);
    }
    return null;
  }

  getCommandMetadata(commandName: string): CommandMetadata | undefined {
    const CommandConstructor = this.registry.get(commandName);
    if (!CommandConstructor) {
      return undefined;
    }
    return this.getCommandMetadataFromConstructor(CommandConstructor);
  }

  private getCommandMetadataFromConstructor(
    CommandConstructor: new (...args: any[]) => Command | null
  ): CommandMetadata | undefined {
    if (CommandConstructor) {
      return CommandConstructor.prototype.__commandMetadata;
    }
    return undefined;
  }
}
