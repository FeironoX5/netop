export class Timer {
  private timer: number | null = null;

  constructor(private tick: () => void) {}

  start(delay: number) {
    this.stop();
    this.timer = setTimeout(this.tick, delay);
  }

  stop() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
