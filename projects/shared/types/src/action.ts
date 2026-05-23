export type PathSegment = string;

export type Action = {
  path: PathSegment[];
  commandName: string;
  args: string[];
};
