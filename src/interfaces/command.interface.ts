import { CommandArgs } from ".";

export interface Command {
  execute(args: CommandArgs): Promise<void>;
}
