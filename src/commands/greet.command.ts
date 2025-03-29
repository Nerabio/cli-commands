import { inject, injectable } from 'inversify';
import { Command } from '../interfaces/command.interface';
import { CommandMetadata } from '../interfaces/command.metadata.interface';
import { CommandDecorator } from './command.decorator';



const metadata: CommandMetadata = {
  name: 'greet',
  description: 'Приветствует пользователя',
};

@CommandDecorator(metadata)
@injectable()
export class GreetCommand implements Command {
  constructor() {}

  async execute(name: string): Promise<void> {
    console.log(`${name}!`);
  }
}