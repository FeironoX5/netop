export class EventTarget<TEvent> {
  private subscribers: Set<(event: TEvent) => void> =
    new Set();

  subscribe(f: (event: TEvent) => void): void {
    this.subscribers.add(f);
  }

  call(event: TEvent): void {
    for (const f of this.subscribers) {
      f(event);
    }
  }
}
