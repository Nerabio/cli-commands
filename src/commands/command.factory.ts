import { Command } from "../interfaces/command.interface";
import { CommandMetadata } from "../interfaces/command.metadata.interface";
import { CommandRegistry } from "./command.registry";
import { CommandFactory } from "../interfaces/command-factory.interface";
import { injectable } from "inversify";
import { container } from "../container";

@injectable()
export class ConcreteCommandFactory implements CommandFactory {
  constructor(private registry: CommandRegistry) {}

  createCommand(commandName: string): Command | null {
    const CommandConstructor = this.registry.getCommandConstructor(commandName);
    if (CommandConstructor) {
      return container.get(CommandConstructor);
    }
    return null;
  }

  getCommandMetadata(commandName: string): CommandMetadata | undefined {
    const CommandConstructor = this.registry.getCommandConstructor(commandName);
    return this.getCommandMetadataFromConstructor(CommandConstructor);
  }

  private getCommandMetadataFromConstructor(CommandConstructor: new (...args: any[]) => Command | null): CommandMetadata | undefined {
    if (CommandConstructor) {
      return CommandConstructor.prototype.__commandMetadata;
    }
    return undefined;
  }
}
