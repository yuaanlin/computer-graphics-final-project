import static3DObject from "./Static3DObject";

class Meadow extends static3DObject {
  constructor() {
    super("bigGrass", "grass");
    this.position.z = -50.5;
    this.position.x = -50.5;
  }
}

export default Meadow;