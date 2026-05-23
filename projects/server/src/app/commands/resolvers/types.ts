import { PathSegment } from '@netop/types';
import { EntityWrapper } from '../interfaces/EntityWrapper';

export type EntityWrapperKey = string;

export type EntityWrapperMap = Map<
  EntityWrapperKey,
  EntityWrapper<any>
>;
export type ResolverFactory<T> = {
  resolver: Resolver<T>;
  wrappers: EntityWrapperMap;
};

export type Resolver<T> = (
  path: PathSegment[],
) => { entity: T; wrapper: EntityWrapper<T> } | undefined;
