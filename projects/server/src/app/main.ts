import { Scene } from './scene';
import { SceneWrapper } from './scene.wrapper';
import { CommandHandler } from './utils/commands/commandHandler';

export const scene = new Scene();

export const commandHandler = new CommandHandler([new SceneWrapper(scene)]);
