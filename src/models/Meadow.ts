import Application from "../Application";
import HittableObject from "./HittableObject";

class Meadow extends HittableObject {
  constructor(app: Application) {
    super("bigGrass", "grass", app);
    this.anchorPoint.z = -50.5;
    this.anchorPoint.x = -50.5;
    this._zEdge = 50;
    this._xEdge = 50;
  }
}

export default Meadow;