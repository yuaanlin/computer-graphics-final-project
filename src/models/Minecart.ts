import Player, {PlayerStateCode} from "./Player";
import {VEHICLE_MAX_ACCELERATION} from "../config";
import Application from "../Application";
import Zombie, {ZombieState} from "./Zombie";
import HittableObject from "./HittableObject";
import {EulerAngles} from "../type";

export enum WheelDirection {
  CENTER, RIGHT, LEFT
}

/**
 * 矿车，一种可以驾驶的车辆
 * */
class MineCart extends HittableObject {
  private readonly _player: Player | undefined;
  private _acceleration: number;
  private _speed: number;

  /** 轮胎的方向 */
  private _direction: WheelDirection;

  /** 当前速度方向 */
  private _moveDirection: EulerAngles;

  constructor(player: Player, app: Application) {
    super('minecart', 'minecart', app);
    this._acceleration = 0;
    this._speed = 0;
    this._direction = 0;
    this.scale = [1, 1, 1];
    this.rotation = {
      ...this.rotation,
      pitch: 3.14
    }
    this._moveDirection = {
      ...this.rotation,
      pitch: 3.14
    }
    this._player = player;
  }

  public speedUp(deltaSpeed: number) {
    if (this._acceleration + deltaSpeed <= VEHICLE_MAX_ACCELERATION)
      this._acceleration += deltaSpeed
  }

  public turnAround(d: WheelDirection) {
    this._direction = d
  }

  onNextTick = (deltaTime: number) => {

    if (Math.abs(this._acceleration) !== 0) {
      this._acceleration += this._acceleration > 0 ? -20 * deltaTime : 20 * deltaTime;
      if (Math.round(100 * this._acceleration) === 0) {
        this._acceleration = 0;
      }
    }

    if (Math.abs(this._speed) !== 0) {
      this._speed += this._speed > 0 ? -5 * deltaTime : 5 * deltaTime;
      if (Math.round(100 * this._speed) === 0) {
        this._speed = 0;

        // 当速度归零，将车辆移动方向与车头方向对齐
        this._moveDirection = {...this.rotation}
      }
    }

    this._speed += this._acceleration * deltaTime;

    let deltaPitch = 0
    switch (this._direction) {
      case WheelDirection.LEFT:
        deltaPitch = -.01 * this._speed * .1;
        break
      case WheelDirection.RIGHT:
        deltaPitch = .01 * this._speed * .1;
        break
    }

    this._moveDirection.pitch += deltaPitch
    this.rotation.pitch += deltaPitch
    if (this._player && this._player.state.code === PlayerStateCode.DRIVING)
      this._player.rotation.pitch -= deltaPitch

    const hitZombie = this._app?.getObjectsByMeshName<Zombie>('zombie')
      .find(zombie => (zombie.isHit(this) && zombie.state === ZombieState.ALIVE));

    if (hitZombie) {
      hitZombie.onHit()
      this._moveDirection.pitch -= 3.14
    }

    this.position = {
      ...this.position,
      x: this.position.x - Math.sin(this._moveDirection.pitch) * this._speed * deltaTime,
      z: this.position.z + Math.cos(this._moveDirection.pitch) * this._speed * deltaTime
    }

  }
}

export default MineCart;