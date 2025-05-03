import { Command } from "../../interfaces/command.interface";

export class CommandRegistry {
  private commands: { [key: string]: new () => Command } = {};

  registerCommand( commandName: string, commandConstructor: new () => Command): void {
    this.commands[commandName] = commandConstructor;
  }

  getCommandConstructor(commandName: string): new () => Command | null {
    return this.commands[commandName];
  }
}