import {
  EntityWrapper,
  EntityWrapperCommand,
} from '@commands/interfaces/EntityWrapper';
import { StringUtils } from '@commands/utils/StringUtils';
import { ActionCodec } from '@netop/utils';
import { ActionHandler } from '../ActionHandler';

const buildHelpPage = (
  path: string[],
  wrapper: EntityWrapper<unknown>,
): string => {
  const entries = Array.from(wrapper.commands.entries());
  const commandList = entries.map(([cmdName, cmd]) => {
    const params = cmd.args?.length
      ? `(${cmd.args.join(', ')})`
      : '';
    return `${cmdName}${params}`;
  });
  return StringUtils.buildPage([
    {
      title:
        path.join(ActionCodec.PATH_DELIMITER) || 'root',
      text: wrapper.info ?? 'no info available',
    },
    {
      title: 'Commands',
      text: StringUtils.buildList(commandList),
    },
  ]);
};

export const CommandHandlerWrapper: EntityWrapper<ActionHandler> =
  {
    info: 'Used to manage commands',
    commands: new Map<
      string,
      EntityWrapperCommand<ActionHandler>
    >([
      [
        'help',
        {
          info: 'Show help for an entity or a specific command. Usage: help [path][command]',
          args: ['path?'],
          fn: (actionHandler, pathStr) => {
            const path = pathStr
              ? pathStr.split(ActionCodec.PATH_DELIMITER)
              : [];
            const resolved = actionHandler.resolve(path);
            if (resolved) {
              return buildHelpPage(path, resolved.wrapper);
            }
            throw new Error('no entity found');
          },
        },
      ],
      [
        'tips',
        {
          info: 'Show tips on using the command system efficiently',
          fn: (_actionHandler) =>
            StringUtils.buildPage([
              {
                title: 'Partial paths',
                text: 'Paths do not need to be fully qualified. The system finds the first entity whose ID or name matches each segment, then continues from there.\n\nExample: "eth0:iface" may resolve to "sc:pc0:eth0:iface" if that is the first matching subtree.',
              },
              {
                title: 'Matching',
                text: "Each segment is matched against both the entity's id and its name. Use whichever is shorter or easier to type.",
              },
              {
                title: 'Root commands',
                text: 'Commands on the root handler (like help and tips) can be invoked without any prefix.\n\nExample: "help" is the same as "help root".',
              },
              {
                title: 'Command syntax',
                text: `Commands are written as [path${ActionCodec.PATH_DELIMITER}]name [args...]\nPath segments are separated by "${ActionCodec.PATH_DELIMITER}".\nArguments are separated by spaces.`,
              },
            ]),
        },
      ],
    ]),
  };
