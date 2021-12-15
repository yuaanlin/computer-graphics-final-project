import { EulerAngles, Position } from '../type';
import {mat4, ReadonlyVec3} from 'gl-matrix';

export default class Player {
  onNextTick: ((deltaTime: number) => void) | undefined;
  private _position: Position;

  constructor() {
    this._moveSpeed = 10;
    this._position = { x: 0, y: 0, z: 0 };
    this._rotation = { pitch: 0, roll: 0, yaw: 0 };
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
    return [this._position.x, this._position.y, this._position.z];
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

  public getProjectionMatrix(_gl: WebGL2RenderingContext) {
    const fieldOfView = (30 * Math.PI) / 180; // in radians
    const aspect = _gl.canvas.clientWidth / _gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 2000.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const m = mat4.create();

    // calculate camera position from this._player.position
    mat4.translate(m, m, this.positionVec3);

    // calculate camera rotation from this._player.rotation (euler angles representation)
    const projectionRotateMatrix = mat4.create();
    {
      const x = this.rotation.roll;
      const y = this.rotation.pitch;
      const z = this.rotation.yaw;
      const cosX = Math.cos(x), sinX = Math.sin(x),
        cosY = Math.cos(y), sinY = Math.sin(y),
        cosZ = Math.cos(z), sinZ = Math.sin(z);
      mat4.set(projectionRotateMatrix,
        cosY * cosZ, -cosX * sinZ + sinX * sinY * cosZ, sinX * sinZ + cosX * sinY * cosZ, 0,
        cosY * sinZ, cosX * cosZ + sinX * sinY * sinZ, -sinX * cosZ + cosX * sinY * sinZ, 0,
        -sinY, sinX * cosY, cosX * cosY, 0,
        0, 0, 0, 1);
      mat4.invert(projectionRotateMatrix, projectionRotateMatrix)
    }
    mat4.multiply(m, m, projectionRotateMatrix);


    mat4.invert(m, m)

    mat4.multiply(projectionMatrix, projectionMatrix, m)

    return projectionMatrix;
  }

}

