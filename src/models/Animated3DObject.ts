import Static3DObject from "./Static3DObject";
import Application from "../Application";

class Animated3DObject extends Static3DObject {
  animationFrame: number;

  constructor(meshName: string, textureName: string, app: Application) {
    super(meshName, textureName, app);
    this.animationFrame = 1;
  }
}

export default Animated3DObject;
