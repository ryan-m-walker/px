const stage = {
  draw() {
    circle();
  },
  log() {
    console.log('yo');
  }
};

function circle() {
  console.log(this);
}

stage.draw();
