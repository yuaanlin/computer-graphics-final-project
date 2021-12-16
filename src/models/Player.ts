import {EulerAngles, Position} from '../type';
import {mat4, ReadonlyVec3} from 'gl-matrix';
import sendPopMessage from "../utils/sendPopMessage";
import InputController from "../InputController";

export enum PlayerStateCode {
  WALKING, DRIVING
}

export interface PlayerWalkingState {
  code: PlayerStateCode.WALKING
}

export interface PlayerDrivingState {
  code: PlayerStateCode.DRIVING
  vehicleId: string
}

export type PlayerState = PlayerWalkingState | PlayerDrivingState;

export default class Player {
  public onNextTick: ((deltaTime: number) => void) | undefined;

  constructor() {
    this._hasSawVehicle = false;
    this._moveSpeed = 10;
    this._position = {x: 0, y: 0, z: 0};
    this._rotation = {pitch: 0, roll: 0, yaw: 0};
  }

  private _position: Position;

  get position(): Position {
    return this._position;
  }

  set position(value: Position) {
    this._position = value;
  }

  // 代表玩家是否曾经靠近过车辆，用于第一次靠近车辆时显示提示
  private _hasSawVehicle: boolean;

  get hasSawVehicle(): boolean {
    return this._hasSawVehicle;
  }

  set hasSawVehicle(value: boolean) {
    this._hasSawVehicle = value;
  }

  private _state: PlayerState = {code: PlayerStateCode.WALKING};

  get state(): PlayerState {
    return this._state;
  }

  set state(value: PlayerState) {
    switch (value.code) {
      case PlayerStateCode.WALKING:
        sendPopMessage("切换到走路模式", '使用 WASD 键移动玩家，鼠标控制视角', 5)
        break
      case PlayerStateCode.DRIVING:
        sendPopMessage("切换到驾驶模式", '使用 WD 键加减速，AD 键控制轮胎方向 ', 5)
        break
    }
    this._state = value;
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

/** 根据键盘及鼠标输入，控制玩家的位置与旋转 */
export function handlePlayerWalking(player: Player, inputController: InputController, deltaTime: number) {

  // When mouse move, rotate the camera
  inputController.onMouseMove = (x, y) => {
    player.rotation = {
      yaw: player.rotation.yaw,
      pitch: player.rotation.pitch - x * .001,
      roll: player.rotation.roll - y * .001
    };
  };

  if (inputController.isKeyPressed('w'))
    player.setPosition({
      x: player.positionX - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
      z: player.positionZ - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
    });

  if (inputController.isKeyPressed(' '))
    player.setPosition({
      x: player.positionX,
      y: player.positionY + .1,
      z: player.positionZ
    });

  if (inputController.isKeyPressed('x'))
    player.setPosition({
      x: player.positionX,
      y: player.positionY - .1 > 2 ? player.positionY - .1 : 2,
      z: player.positionZ
    });

  if (inputController.isKeyPressed('s'))
    player.setPosition({
      x: player.positionX + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
      z: player.positionZ + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
    });

  if (inputController.isKeyPressed('d'))
    player.setPosition({
      x: player.positionX + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
      z: player.positionZ - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
    });

  if (inputController.isKeyPressed('a'))
    player.setPosition({
      x: player.positionX - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
      z: player.positionZ + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
    });

}
