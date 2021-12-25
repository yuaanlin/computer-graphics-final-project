import static3DObject from "./Static3DObject";
import Application from "../Application";

class Meadow extends static3DObject {
  constructor(app: Application) {
    super("bigGrass", "grass", app);
    this.position.z = -50.5;
    this.position.x = -50.5;
  }
}

export default Meadow;