import Application from "../Application";
import HittableAnimatedObject from "./HittableAnimatedObject";
import {EulerAngles} from "../type";
import {STEROID_SPEED} from "../config";
import HittableObject from "./HittableObject";
import Meadow from "./Meadow";
import Minecart from "./Minecart";

class Steroid extends HittableAnimatedObject {
  b: number;
  private _direction: EulerAngles;

  constructor(app: Application, direction: EulerAngles) {
    super('steroid', 'grass', app);

    this._direction = direction;
    this.b = 0;
    this.scale = [2, 2, 2]
    this._yEdge = 1;
    this.anchorPoint.y = -3;

    this.onNextTick = (deltaTime) => {
      const oldB = this.b;
      this.b += deltaTime
      if (Math.round(this.b * 10) !== Math.round(oldB * 10)) {
        this.animationFrame = ((this.animationFrame + 1) % 3) + 1;
      }
      this.position = {
        x: this.position.x - Math.sin(this._direction.pitch) * STEROID_SPEED * deltaTime,
        y: this.position.y + this._direction.yaw * .4 * STEROID_SPEED * deltaTime,
        z: this.position.z + Math.cos(this._direction.pitch) * STEROID_SPEED * deltaTime
      }
    }
  }

  onHit(_obj: HittableObject | HittableAnimatedObject) {
    super.onHit(_obj);
    if (_obj instanceof Meadow)
      this._app.removeObject(this.id)
    if (_obj instanceof Minecart)
      alert('GG!')
  }
}

export default Steroid;