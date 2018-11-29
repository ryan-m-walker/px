import * as PX from '../../src/index';
import { px } from './index';

export class Ball {
  position: PX.Vector;
  velocity: PX.Vector;
  acceleration: PX.Vector;

  getBounds() {
    return {
      top: this.position.y - this.r,
      right: this.position.x + this.r,
      bottom: this.position.y + this.r,
      left: this.position.x - this.r,
    };
  }

  constructor(x: number, y: number, public r: number) {
    this.position = new PX.Vector(x, y);
    this.velocity = new PX.Vector(0, 0);
    this.acceleration = new PX.Vector(0, 0);
  }

  move() {
    if (px.keyDown(px.RIGHT_ARROW)) {
      this.addForce(new PX.Vector(0.05, 0));
    }

    if (px.keyDown(px.LEFT_ARROR)) {
      this.addForce(new PX.Vector(-0.05, 0));
    }

    if (px.keyDown(px.UP_ARROW)) {
      this.addForce(new PX.Vector(0, -0.05));
    }

    if (px.keyDown(px.DOWN_ARROW)) {
      this.addForce(new PX.Vector(0, 0.05));
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(10);
    this.position.add(this.velocity);
    this.acceleration.multiply(0);
  }

  addForce(force: PX.Vector) {
    const f = force.copy();
    this.acceleration.add(f);
  }

  applyGravity() {
    const g = new PX.Vector(0, 0.08);
    this.addForce(g);
  }

  render() {
    px.fill('orange');
    px.circle(this.position.x, this.position.y, this.r);
  }

  step() {
    this.checkEdges();
    this.move();
    this.render();
    this.update();
    this.acceleration.multiply(0);
  }

  checkEdges() {
    const { top, right, bottom, left } = this.getBounds();
    if (top < 0) {
      this.position.y = this.r;
      this.velocity.y *= -1;
    } else if (bottom > px.height) {
      this.position.y = px.height - this.r;
      this.velocity.y *= -1;
    }

    if (right > px.width) {
      this.position.x = px.width - this.r;
      this.velocity.x *= -1;
    } else if (left < 0) {
      this.position.x = this.r;
      this.velocity.x *= -1;
    }
  }
}
