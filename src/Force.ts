import { PhysicsObject } from './PhysicsObject';
import { Vector } from './index';

export class Force {
  static attract(
    x: number,
    y: number,
    other: PhysicsObject,
    mass = 1,
    G = 0.4
  ) {
    const attractor = new Vector(x, y);
    const force = Vector.subract(attractor, other.position);
    const distance = force.magnitude();
    force.normalize();

    if (distance !== 0) {
      const strength = ((G * mass * other.mass) / distance) * distance;
      force.multiply(strength);
      other.addForce(force);
    }
  }
}
