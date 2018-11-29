import * as PX from '../../src/index';
import { Graph } from './Graph';

export const px = new PX.Stage('canvas');
px.resizeCanvas(window.innerWidth, window.innerHeight);

// window.onkeydown = e => e.preventDefault();

window.onresize = () => {
  px.resizeCanvas(window.innerWidth, window.innerHeight);
};

const g = new Graph(px.width / 2, px.height / 2);

px.render = () => {
  px.background('#222');
  g.render();
  g.applyPhysics();
  // g.addForce(new PX.Vector(0.1, 0));
  // px.pause();
};
