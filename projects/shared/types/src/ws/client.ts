export enum ClientMessageType {
  Action = 'action',
}

export type ClientMessage = {
  type: ClientMessageType.Action;
  body: string;
};
