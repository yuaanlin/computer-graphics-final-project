import static3DObject from "./Static3DObject";
import Player from "./Player";
import {VEHICLE_MAX_ACCELERATION} from "../config";

export enum WheelDirection {
  CENTER, RIGHT, LEFT
}

/**
 * 矿车，一种可以驾驶的车辆
 * */
class MineCart extends static3DObject {
  private _acceleration: number;
  private _speed: number;
  private _direction: WheelDirection;
  private readonly _player: Player | undefined;

  constructor(player?: Player) {
    super('minecart', 'minecart');
    this._acceleration = 0;
    this._speed = 0;
    this._direction = 0;
    this.scale = [1, 1, 1];
    this.rotation = {
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
      }
    }

    this._speed += this._acceleration * deltaTime;

    switch (this._direction) {
      case WheelDirection.LEFT:
        this.rotation.pitch -= .01 * this._speed * .1;
        if (this._player) this._player.rotation.pitch += .01 * this._speed * .1;
        break
      case WheelDirection.RIGHT:
        this.rotation.pitch += .01 * this._speed * .1;
        if (this._player) this._player.rotation.pitch -= .01 * this._speed * .1;
        break
    }

    this.position = {
      ...this.position,
      x: this.position.x - Math.sin(this.rotation.pitch) * this._speed * deltaTime,
      z: this.position.z + Math.cos(this.rotation.pitch) * this._speed * deltaTime
    }

  }
}

export default MineCart;