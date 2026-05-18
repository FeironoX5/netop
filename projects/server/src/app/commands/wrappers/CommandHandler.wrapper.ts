import { CommandHandler } from '@commands/CommandHandler';
import {
  EntityWrapper,
  EntityWrapperCommand,
} from '@commands/interfaces/EntityWrapper';
import { StringUtils } from '@commands/utils/StringUtils';

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
      title: path.join(':') || 'root',
      text: wrapper.info ?? 'no info available',
    },
    {
      title: 'Commands',
      text: StringUtils.buildList(commandList),
    },
  ]);
};

export const CommandHandlerWrapper: EntityWrapper<CommandHandler> =
  {
    info: 'Used to manage commands',
    commands: new Map<
      string,
      EntityWrapperCommand<CommandHandler>
    >([
      [
        'help',
        {
          info: 'Show help for an entity or a specific command. Usage: help [path][:command]',
          args: ['path?'],
          fn: (commandHandler, pathStr) => {
            const segments = pathStr
              ? pathStr.split(':')
              : [];

            // 1. Try full path as an entity path
            const resolved =
              commandHandler.resolve(segments);
            if (resolved) {
              return buildHelpPage(
                segments,
                resolved.wrapper,
              );
            }

            // 2. Try parent as entity path, last segment as command name
            if (segments.length > 1) {
              const parentPath = segments.slice(0, -1);
              const commandName =
                segments[segments.length - 1];
              const parentResolved =
                commandHandler.resolve(parentPath);
              if (parentResolved) {
                const command =
                  parentResolved.wrapper.commands.get(
                    commandName,
                  );
                if (command)
                  return (
                    command.info ?? 'no info available'
                  );
              }
            }

            throw new Error('no entity found');
          },
        },
      ],
      [
        'tips',
        {
          info: 'Show tips on using the command system efficiently',
          fn: (_commandHandler) =>
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
                text: 'Commands are written as [path:]name [args...]\nPath segments are separated by ":".\nArguments are separated by spaces.',
              },
            ]),
        },
      ],
    ]),
  };
