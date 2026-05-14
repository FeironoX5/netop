import { Scene } from './Scene';
import { SceneWrapper } from './Scene.wrapper';
import { CommandHandler } from './utils/commands/CommandHandler';

export const scene = new Scene();

export const commandHandler = new CommandHandler([
  new SceneWrapper(scene),
]);
