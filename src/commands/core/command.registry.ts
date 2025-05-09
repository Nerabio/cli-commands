import { Container, inject, injectable } from "inversify";
import { Command } from "../../interfaces";
import { COMMAND_METADATA_KEY } from "../../constants";

@injectable()
export class CommandRegistry {
  private readonly commands = new Map<
    string,
    new (...args: any[]) => Command
  >();

  constructor(@inject(Container) private readonly container: Container) {}

  register(constructor: new (...args: any[]) => Command): void {
    const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, constructor);
    if (!metadata) {
      throw new Error(`Command ${constructor.name} has no metadata`);
    }
    this.commands.set(metadata.name, constructor);
  }

  get(name: string): (new (...args: any[]) => Command) | undefined {
    return this.commands.get(name);
  }

  getAll(): Array<{ name: string; constructor: new (...args: any[]) => any }> {
    return Array.from(this.commands.entries()).map(([name, constructor]) => ({
      name,
      constructor,
    }));
  }
  //private commands: { [key: string]: new () => Command } = {};

  // registerCommand(
  //   commandName: string,
  //   commandConstructor: new () => Command
  // ): void {
  //   this.commands[commandName] = commandConstructor;
  // }

  // getCommandConstructor(commandName: string): new () => Command | null {
  //   return this.commands[commandName];
  // }

  /* 
  sdfg
  sfg
  sdfg
  sdf
  gsd
  fg
  sdg
  dsgf
  */
}
