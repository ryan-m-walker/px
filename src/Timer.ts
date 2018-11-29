export interface TimerCallback {
  (tick: Number): void;
}

export type TimerIndex =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type Timers = { [t in TimerIndex]: Timer | null };

export class Timer {
  public endTime: number;

  constructor(
    public timerIndex: TimerIndex,
    public startTick: number,
    public endTick: number,
    public callback: TimerCallback
  ) {
    this.endTime = this.startTick + this.endTick;
  }
}
