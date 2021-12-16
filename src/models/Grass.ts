import Static3DObject from "./Static3DObject";

class Grass extends Static3DObject {
  constructor() {
    super('grass', 'grass');
    this.scale = [0.5, 0.5, 0.5];
  }
}

export default Grass;