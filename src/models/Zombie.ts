import HittableObject from "./HittableObject";
import Application from "../Application";
import Minecart from "./Minecart";
import {STEROID_START_COUNT} from "../config";

export enum ZombieState {
  ALIVE, HIT, DEAD
}

class Zombie extends HittableObject {
  constructor(app: Application) {
    super("zombie", "zombie", app);
    this.scale = [.08, .08, .08]
    this._state = ZombieState.ALIVE
    this.anchorPoint.y = -1

    this.onNextTick = (t) => {
      if (this._state === ZombieState.HIT) {
        this.rotation.yaw += 3.14 / (t * 12000)
        if (this.rotation.yaw > 3.14 / 2) {
          this._state = ZombieState.DEAD
          setTimeout(() => {
            this._app.removeObject(this.id)
          }, 5000)
        }
      }
    }

  }

  private _state: ZombieState;

  get state(): ZombieState {
    return this._state;
  }

  override onHit(obj: HittableObject) {
    if (this.state !== ZombieState.ALIVE) return;
    if (obj instanceof Minecart) {
      this._app.killedZombieCount++;
      if (this._app.killedZombieCount === STEROID_START_COUNT) {
        this._app.sendPopMessage('小心点！', '附近的僵尸巨人将开始对你扔出巨大泥土块！', 3)
      } else {
        this._app.sendPopMessage('做得好！', '你撞死了一只僵尸，继续加油！', 3)
      }
      this._state = ZombieState.HIT;
    }
  }

}

export default Zombie;