export class Keyboard {
  private _keysDown: any = {};

  constructor() {
    this.initEvents();
  }

  initEvents() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this._keysDown[e.keyCode] = true;
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this._keysDown[e.keyCode] = false;
    });
  }

  public keyDown(keyCode: number): boolean {
    if (!this._keysDown[keyCode]) {
      this._keysDown[keyCode] = false;
    }
    return this._keysDown[keyCode];
  }
}
