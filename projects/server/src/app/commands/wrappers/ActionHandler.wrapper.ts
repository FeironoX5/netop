import { ActionHandler } from '@commands/ActionHandler';
import {
  EntityWrapper,
  EntityWrapperCommand,
} from '@commands/interfaces/EntityWrapper';
import { ActionCodec } from '@netop/utils';
import { StringUtils } from '@/app/utils/StringUtils';
import { ResolverFactory } from '../resolvers/types';

function findWrapper(
  factories: ResolverFactory<any>[],
  wrapperKey: string,
): EntityWrapper<any> {
  const factory = factories.find((factory) =>
    factory.wrappers.has(wrapperKey),
  );
  if (!factory) {
    throw new Error('no wrapper with such key');
  }
  return factory.wrappers.get(wrapperKey)!;
}

function buildCommandList(
  wrapper: EntityWrapper<any>,
): string {
  const entries = [...wrapper.commands.entries()];
  return StringUtils.buildList(
    entries.map(([cmdName, cmd]) => {
      const params = cmd.args?.length
        ? `(${cmd.args.join(', ')})`
        : '';
      const info = cmd.info ? ` ${cmd.info}` : '';
      return `${cmdName}${params}${info}`;
    }),
  );
}
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
          info: 'Show help for an entity or a specific command.',
          args: ['wrapperKey?'],
          fn: (actionHandler, wrapperKey?: string) => {
            const wrapper = wrapperKey
              ? findWrapper(
                  actionHandler.getFactories(),
                  wrapperKey,
                )
              : CommandHandlerWrapper;
            return StringUtils.buildPage([
              {
                title: wrapperKey ?? 'Command Handler',
                text: wrapper.info ?? 'no info provided',
              },
              {
                title: 'Commands',
                text: buildCommandList(wrapper),
              },
              ...(!wrapperKey
                ? [
                    {
                      title: 'Wrapper keys',
                      text: StringUtils.buildList(
                        actionHandler
                          .getFactories()
                          .flatMap((f) =>
                            Array.from(f.wrappers.keys()),
                          ),
                      ),
                    },
                  ]
                : []),
            ]);
          },
        },
      ],
      [
        'tips',
        {
          info: 'Show tips on using the command system efficiently',
          fn: () =>
            StringUtils.buildPage([
              {
                title: 'Partial paths',
                text: 'Paths do not need to be fully qualified. The system finds the first entity whose ID or name matches each segment, then continues from there.\n\nExample: "eth0:child1" may resolve to "sc:pc0:eth0:child1" if that is the first matching subtree.',
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
