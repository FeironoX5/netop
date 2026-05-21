export type PathSegment = string;

export interface Action {
  path: PathSegment[];
  command: string;
  args: string[];
}
