export type ReqProp<T, K extends keyof T> = Required<
  Pick<T, K>
> &
  T;
