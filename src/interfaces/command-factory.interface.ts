import { Command } from './command.interface';

export interface CommandFactory {
  createCommand(commandName: string): Command | null;
}