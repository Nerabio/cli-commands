import { COMMAND_METADATA_KEY } from "../constants";
import { CommandMetadata } from "../interfaces";

export function CommandDecorator(metadata: CommandMetadata) {
  return (target: any) => {
    Reflect.defineMetadata(COMMAND_METADATA_KEY, metadata, target);
  };
}
