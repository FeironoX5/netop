export type PathSegment = string;

export interface Action {
  path: PathSegment[];
  commandName: string;
  args: string[];
}
