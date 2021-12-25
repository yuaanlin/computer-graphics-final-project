import Static3DObject from "./Static3DObject";
import Application from "../Application";

class Grass extends Static3DObject {
  constructor(app: Application) {
    super('grass', 'grass', app);
    this.scale = [0.5, 0.5, 0.5];
  }
}

export default Grass;