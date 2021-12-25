import Application from "../Application";
import HittableAnimatedObject from "./HittableAnimatedObject";
import {EulerAngles} from "../type";
import {STEROID_SPEED} from "../config";
import HittableObject from "./HittableObject";
import Minecart from "./Minecart";

class Steroid extends HittableAnimatedObject {
  b: number;

  constructor(app: Application, direction: EulerAngles) {
    super('steroid', 'grass', app);

    this._direction = direction;
    this.b = 0;
    this.scale = [2, 2, 2]
    this._xEdge = 3;
    this._yEdge = 3;
    this._zEdge = 3;
    this.anchorPoint.y = -3;

    this.onNextTick = (deltaTime) => {
      const oldB = this.b;
      this.b += deltaTime
      if (Math.round(this.b * 10) !== Math.round(oldB * 10)) {
        this.animationFrame = ((this.animationFrame + 1) % 3) + 1;
      }
      if (this.position.y < -1) {
        this._app.removeObject(this.id)
      }

      const speed = STEROID_SPEED + this._app.killedZombieCount * 10

      this.position = {
        x: this.position.x - Math.sin(this._direction.pitch) * speed * deltaTime,
        y: this.position.y + this._direction.yaw * .4 * speed * deltaTime,
        z: this.position.z + Math.cos(this._direction.pitch) * speed * deltaTime
      }
    }
  }

  private _direction: EulerAngles;

  get direction(): EulerAngles {
    return this._direction;
  }

  onHit(_obj: HittableObject | HittableAnimatedObject) {
    super.onHit(_obj);
    if (_obj instanceof Minecart) {
      this._app.sendPopMessage('游戏结束', '你被僵尸巨人扔出的大型泥土砸死了', 5)
      this._app.gameOver()
    }
  }
}

export default Steroid;