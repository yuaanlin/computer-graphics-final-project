import {EulerAngles, Position} from "./type";
import {ReadonlyVec3} from "gl-matrix";

export default class Player {
  onNextTick: ((deltaTime: number) => void) | undefined;
  private _position: Position;

  constructor() {
    this._moveSpeed = 10;
    this._position = {x: 0, y: 0, z: 0}
    this._rotation = {pitch: 0, roll: 0, yaw: 0}
  }

  private _rotation: EulerAngles;

  get rotation(): EulerAngles {
    return this._rotation;
  }

  set rotation(value: EulerAngles) {
    this._rotation = value;
  }

  private _moveSpeed: number;

  get moveSpeed(): number {
    return this._moveSpeed;
  }

  set moveSpeed(value: number) {
    this._moveSpeed = value;
  }

  get positionVec3(): ReadonlyVec3 {
    return [this._position.x, this._position.y, this._position.z]
  }

  get positionX(): number {
    return this._position.x;
  }

  get positionY(): number {
    return this._position.y;
  }

  get positionZ(): number {
    return this._position.z;
  }

  public setPosition(pos: { x?: number, y?: number, z?: number }) {
    if (pos.x) this._position.x = pos.x;
    if (pos.y) this._position.y = pos.y;
    if (pos.z) this._position.z = pos.z;
  }

}

