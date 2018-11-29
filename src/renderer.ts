import { Vector } from './Vector';

interface CircleState {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
}

class Circle {
  state: CircleState;

  constructor(x: number, y: number) {
    this.state = {
      position: new Vector(x, y),
      velocity: new Vector(0, 0),
      acceleration: new Vector(0, 0)
    };
  }

  draw(tick: number) {}
}

// px.render(Obj, document.getElementById('canvas'));

/*

const stage = new px.Stage('canvas', {
  setup,
  draw
});

stage.setup = () => {

};

stage.draw = () => {

};

*/
