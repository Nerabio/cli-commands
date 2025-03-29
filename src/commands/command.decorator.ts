import { Command } from '../interfaces/command.interface';
import { CommandRegistry } from './command.registry';
import { CommandMetadata } from '../interfaces/command.metadata.interface';


export function CommandDecorator(metadata: CommandMetadata) {
    return (target: new () => Command) => {
        //lazyInject(CommandRegistry)(target, "registry");
      //  console.log('CommandDecorator -> container', container);
       // const commandRegistry: CommandRegistry = container.get(CommandRegistry);
       // commandRegistry.registerCommand(metadata.name, target);
        target.prototype.__commandMetadata = metadata;
    };
}


