import { Vector } from './Vector';

export class PhysicsObject {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxVelocity = 100;

  angle = 0;
  angularVelocity = 0;
  angularAcceleration = 0;
  maxAngularVelocity = 100;

  mass = 1;
  G = 0.04;

  gravity = 0;

  setGravity(gavity: number) {
    this.gravity = gavity;
  }

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
  }

  applyPhysics() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity);
    this.position.add(this.velocity);
    this.acceleration.multiply(0);

    this.angularVelocity += this.angularAcceleration;
    if (
      this.angularVelocity &&
      this.angularVelocity > this.maxAngularVelocity
    ) {
      this.angularVelocity = this.maxAngularVelocity;
    }
    this.angle += this.angularVelocity;
    this.angularAcceleration = 0;

    if (this.gravity) {
      this.applyGravity();
    }
  }

  addForce(force: Vector) {
    const f = force.copy();
    this.acceleration.add(f);
  }

  addAngularForce(force: number) {
    this.angularAcceleration += force;
  }

  applyGravity() {
    const g = new Vector(0, this.gravity);
    this.addForce(g);
  }

  attract(other: PhysicsObject) {
    const force = Vector.subract(this.position, other.position);
    const distance = force.magnitude();
    force.normalize();

    if (distance !== 0) {
      const strength =
        ((this.G * this.mass * other.mass) / distance) * distance;
      force.multiply(strength);
      other.addForce(force);
    }
  }
}
