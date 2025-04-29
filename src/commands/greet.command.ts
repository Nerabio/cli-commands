import { inject, injectable } from 'inversify';
import { Command } from '../interfaces/command.interface';
import { CommandMetadata } from '../interfaces/command.metadata.interface';
import { CommandDecorator } from './command.decorator';
import { FileProcessingState } from '../procedures/file-processing-state';
import { removeEmptyLines } from '../procedures/remove-empty-lines.function';
import { removeLinesWithWord } from '../procedures/remove-lines-with-word.function';
import { replaceComments } from '../procedures/replace-comments.function';
import { processFile } from '../procedures/process-file';




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
    const fileContent = `
// Это комментарий
const x = 10;
// TODO: Доделать эту функцию
function foo() {
  return x * 2;
}

// Ещё один комментарий
console.log(foo());
`;


const initialState = new FileProcessingState(fileContent, "example.js");

const finalState = processFile(
  initialState,
  removeEmptyLines(),         // Удаляем пустые строки
  replaceComments(),          // Удаляем комментарии //
  removeLinesWithWord("TODO") // Удаляем строки с TODO
);

console.log(finalState.currentContent);
  }
}