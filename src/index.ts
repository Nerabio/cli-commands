import 'reflect-metadata';
import { program } from 'commander';
import { container } from './container';
import { ConcreteCommandFactory } from './commands/command.factory';
import { CommandRegistry } from './commands/command.registry';
import { GreetCommand } from './commands/greet.command';


const commandRegistry = container.get(CommandRegistry);
commandRegistry.registerCommand(GreetCommand, "greet");
const commandFactory = container.get(ConcreteCommandFactory);


program
  .command('greet <name>')
  .action( (name) => {
    const command = commandFactory.createCommand('greet');
    if (command) {
      command.execute(name);
    }
  });



program.parse(process.argv);