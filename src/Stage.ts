import { Vector } from './Vector';
import { Keyboard } from './Keyboard';

interface CreateCanvasConfig {
  width?: number;
  height?: number;
}

export class Stage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private _delta = 0;
  private _tick = 0;

  getDelta() {
    return this._delta;
  }

  getTick() {
    return this._tick;
  }

  render: Function | undefined = undefined;

  constructor(canvas: HTMLCanvasElement | string) {
    if (typeof canvas === 'string') {
      this.canvas = <HTMLCanvasElement>document.getElementById(canvas);
    } else {
      this.canvas = canvas;
    }
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    window.requestAnimationFrame(() => this._frame(0));

    this.initEvents();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', e => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  static createCanvas(
    rootNode?: string | HTMLElement,
    config: CreateCanvasConfig = {}
  ): Stage {
    if (!rootNode) {
      rootNode = document.body;
    }

    const canvas = document.createElement('canvas');
    canvas.width = config!.width || 500;
    canvas.height = config!.height || 500;
    // If ID is provided
    if (typeof rootNode === 'string') {
      const node = document.getElementById(rootNode);
      if (!node) {
        throw new Error('Can not find node with ID: ' + rootNode);
      } else {
        node.appendChild(canvas);
      }
    } else {
      rootNode.appendChild(canvas);
    }
    return new Stage(canvas);
  }

  // -------------------------------------------------------------
  //  #INTERNALS
  //--------------------------------------------------------------

  private _frame(lastTime: number) {
    const timeNow = window.performance.now();
    const delta = timeNow - lastTime;

    this._delta = delta / 1000;

    if (this._running) {
      window.requestAnimationFrame(() => this._frame(timeNow));
    }

    this.ctx.clearRect(0, 0, 300, 300);

    if (this.render) {
      this.render(this._tick, delta);
    }
    this._tick += 1;
  }

  // -------------------------------------------------------------
  //  #ENVIRONMENT
  //--------------------------------------------------------------

  private _running = true;

  resizeCanvas(x: number, y: number) {
    this.canvas.width = x;
    this.canvas.height = y;
  }

  rotate(radians: number) {
    this.ctx.rotate(radians);
  }

  get width(): number {
    return this.canvas.width;
  }

  get centerX(): number {
    return this.width / 2;
  }

  get height(): number {
    return this.canvas.height;
  }

  get centerY(): number {
    return this.height / 2;
  }

  pause() {
    this._running = false;
  }

  resume() {
    if (!this._running) {
      this._running = true;
      window.requestAnimationFrame(() => this._frame(window.performance.now()));
    }
  }

  translate(x: number, y: number) {
    this.ctx.translate(x, y);
  }

  save() {
    this.ctx.save();
  }

  restore() {
    this.ctx.restore();
  }

  mouseX = 0;
  mouseY = 0;

  // -------------------------------------------------------------
  //  #SHAPES
  //--------------------------------------------------------------

  line(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  CENTER = 'center';
  TOP_LEFT = 'topLeft';

  private _rectDrawAnchor = this.TOP_LEFT;

  rectAnchor(position: string) {
    this._rectDrawAnchor = position;
  }

  rect(x: number, y: number, w: number, h: number) {
    let offsetX = 0;
    let offsetY = 0;

    switch (this._rectDrawAnchor) {
      case this.CENTER:
        offsetX - w / 2;
        offsetY - h / 2;
        break;
      default:
        offsetX = 0;
        offsetY = 0;
    }

    if (this._fill) {
      this.ctx.fillRect(x + offsetX, y + offsetY, w, h);
    }

    if (this._stroke) {
      this.ctx.strokeRect(x + offsetX, y + offsetY, w, h);
    }
  }

  circle(x: number, y: number, r: number, color: string = 'black') {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    if (this._fill) {
      this.ctx.fill();
    }

    if (this._stroke) {
      this.ctx.stroke();
    }
    this.ctx.closePath();
    this.ctx.restore();
  }

  lineWidth(width: number) {
    this.ctx.lineWidth = width;
  }

  lineCap(cap: CanvasLineCap) {
    this.ctx.lineCap = cap;
  }

  lineJoin(join: CanvasLineJoin) {
    this.ctx.lineJoin = join;
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    antiClockwise?: boolean
  ) {
    this.ctx.arc(x, y, radius, startAngle, endAngle, antiClockwise);
  }

  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.lineTo(x1, y1);

    if (this._fill) {
      this.ctx.fill();
    }

    if (this._stroke) {
      this.ctx.stroke();
    }

    this.ctx.closePath();
  }

  point(x: number, y: number) {
    this.ctx.save();
    this.circle(x, y, this.ctx.lineWidth);
    this.ctx.restore();
  }

  // -------------------------------------------------------------
  //  #COLOR
  //--------------------------------------------------------------

  private _fill = true;
  private _stroke = true;

  alpha(amount: number) {
    this.ctx.globalAlpha = amount;
  }

  background(color: string | CanvasGradient | CanvasPattern) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // TODO make this just work for color
  stroke(
    color: string | CanvasGradient | CanvasPattern,
    weight?: number,
    cap?: CanvasLineCap,
    join?: CanvasLineJoin
  ) {
    this._stroke = true;
    this.ctx.strokeStyle = color;
    if (weight) {
      this.ctx.lineWidth = weight;
    }

    if (cap) {
      this.ctx.lineCap = cap;
    }

    if (join) {
      this.ctx.lineJoin = join;
    }
  }

  noStroke() {
    this._stroke = false;
  }

  noFill() {
    this._fill = false;
  }

  fill(color: string | CanvasGradient | CanvasPattern) {
    this._fill = true;
    this.ctx.fillStyle = color;
  }

  // -------------------------------------------------------------
  //  #GEOMETRY
  //--------------------------------------------------------------

  // -------------------------------------------------------------
  //  #KEYCODES
  //--------------------------------------------------------------

  private _keyBoard = new Keyboard();

  keyDown(key: number) {
    return this._keyBoard.keyDown(key);
  }

  BACKSPACE = 8;
  TAB = 9;
  ENTER = 13;
  SHIFT = 16;
  CTRL = 17;
  ALT = 18;
  ESCAPE = 27;
  LEFT_ARROR = 37;
  UP_ARROW = 38;
  RIGHT_ARROW = 39;
  DOWN_ARROW = 40;
}
