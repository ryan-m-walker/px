import * as PX from '../../src/index';
import { px } from './index';

export class Node extends PX.PhysicsObject {
  constructor(x: number, y: number) {
    super(x, y);
  }

  maxVelocity = 1;

  render() {
    const distance = new PX.Vector(px.mouseX, px.mouseY)
      .subtract(this.position)
      .magnitude();

    console.log(distance);

    if (distance < 200) {
      PX.Force.attract(px.mouseX, px.mouseY, this, 1, 2);
      console.log(px.mouseX);
    }
    // this.acceleration
    this.applyPhysics();
    // this.setGravity(3);
    // this.applyGravity();

    px.save();
    px.translate(this.position.x, this.position.y);
    px.fill('#fff');
    px.stroke('yellow');
    px.noFill();
    px.circle(0, 0, 10);
    px.restore();
  }
}

export class NodeNest extends PX.PhysicsObject {
  node: Node;

  constructor(x: number, y: number) {
    super(x, y);
    this.node = new Node(this.position.x, this.position.y);
  }

  update() {
    px.stroke('orange');
    px.circle(this.position.x, this.position.y, 5);
    this.node.applyPhysics();
    // this.attract(this.node);
    this.node.render();
  }
}

export class Graph extends PX.PhysicsObject {
  children: NodeNest[] = [];
  radius = 160;

  constructor(x: number, y: number) {
    super(x, y);

    // px.save();
    // px.translate(this.position.x, this.position.y);
    for (let i = 0; i < 6; i++) {
      const angle = ((2 * Math.PI) / 6) * i - Math.PI / 6;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);
      this.children.push(new NodeNest(x, y));
    }

    // // px.restore();

    // console.log(this);
  }

  render() {
    px.save();
    px.translate(this.position.x, this.position.y);

    for (let i = 0; i < this.children.length; i++) {
      const angle = ((2 * Math.PI) / 6) * i - Math.PI / 6;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);
      // px.circle(x, y, 6);
      this.children[i].position.x = x;
      this.children[i].position.y = y;
      this.children[i].update();
    }

    px.restore();
  }
}
