import { Command } from '../interfaces/command.interface';
import { CommandRegistry } from './command.registry';
import { CommandMetadata } from '../interfaces/command.metadata.interface';
import { Container } from 'inversify';

/**
 * Decorator for registering a command.
 * @param metadata - Metadata for the command.
 * @returns A decorator function.
 */
const pendingRegistrations: Array<(container: Container) => void> = [];

export function CommandDecorator(metadata: CommandMetadata) {
    return (target: new () => Command) => {
        target.prototype.__commandMetadata = metadata;
        pendingRegistrations.push((container) => {
            const registry = container.get(CommandRegistry);
            registry.registerCommand(metadata.name, target);
        });
    };
}

export function initializeCommands(container: Container) {
    pendingRegistrations.forEach(register => register(container));
    pendingRegistrations.length = 0; 
}
