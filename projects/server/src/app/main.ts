import { CommandHandler } from './commands/commandHandler';
import { SceneWrapper } from './commands/sceneWrapper';
import { Scene } from './scene';

export const scene = new Scene();

export const sceneWrapper = new SceneWrapper(scene);
export const commandHandler = new CommandHandler([sceneWrapper]);
