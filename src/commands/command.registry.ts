import { Command } from "../interfaces/command.interface";


export class CommandRegistry {
  private commands: { [key: string]: new () => Command } = {};

  constructor() {
   // console.log('I am CommandRegistry ctor');
   // console.trace('CommandRegistry initialized');
  }

  registerCommand(commandConstructor: new () => Command, commandName: string = ''): void {
    commandName = commandName || commandConstructor.name;
    this.commands[commandName] = commandConstructor;
  }

  getCommandConstructor(commandName: string): new () => Command | null {
    return this.commands[commandName];
  }
}