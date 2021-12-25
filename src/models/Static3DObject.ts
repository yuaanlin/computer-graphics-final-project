import {EulerAngles, Position} from '../type';
import {mat4, ReadonlyVec3} from 'gl-matrix';
import uuid from "../utils/uuid";
import Application from "../Application";

class Static3DObject {
  id: string;
  mesh: string;
  texture: string;
  position: Position;
  anchorPoint: Position;
  rotation: EulerAngles;
  scale: ReadonlyVec3;
  onNextTick: ((deltaTime: number) => void) | undefined;
  protected readonly _app: Application;

  constructor(meshName: string, textureName: string, app: Application) {
    this.id = uuid();
    this.mesh = meshName;
    this.texture = textureName;
    this.scale = [1, 1, 1];
    this.position = {x: 0, y: 0, z: 0};
    this.rotation = {yaw: 0, pitch: 0, roll: 0};
    this.anchorPoint = {x: 0, y: 0, z: 0};
    this._app = app
  }

  public multiplyRotationMatrix(modelViewMatrix: mat4) {
    const mr = mat4.create();
    const anchor = this.anchorPoint;
    mat4.translate(mr, mr, [anchor.x, anchor.y, anchor.z])
    const modelRotateMatrix = mat4.create();
    const x = this.rotation.roll;
    const y = this.rotation.pitch;
    const z = this.rotation.yaw;
    const cosX = Math.cos(x), sinX = Math.sin(x),
      cosY = Math.cos(y), sinY = Math.sin(y),
      cosZ = Math.cos(z), sinZ = Math.sin(z);
    mat4.set(modelRotateMatrix,
      cosY * cosZ, -cosX * sinZ + sinX * sinY * cosZ, sinX * sinZ + cosX * sinY * cosZ, 0,
      cosY * sinZ, cosX * cosZ + sinX * sinY * sinZ, -sinX * cosZ + cosX * sinY * sinZ, 0,
      -sinY, sinX * cosY, cosX * cosY, 0,
      0, 0, 0, 1);
    mat4.multiply(modelViewMatrix, modelViewMatrix, mr)
    mat4.multiply(modelViewMatrix, modelViewMatrix, modelRotateMatrix);
    mat4.invert(mr, mr)
    mat4.multiply(modelViewMatrix, modelViewMatrix, mr);
  }

  public multiplyScaleMatrix(modelViewMatrix: mat4) {
    mat4.scale(modelViewMatrix, modelViewMatrix, this.scale);
  }

  public multiplyTranslateMatrix(modelViewMatrix: mat4) {
    const mr = mat4.create();
    const anchor = this.anchorPoint;
    mat4.translate(mr, mr, [anchor.x, anchor.y, anchor.z])
    mat4.multiply(modelViewMatrix, modelViewMatrix, mr)
    mat4.translate(modelViewMatrix, modelViewMatrix, [
      this.position.x,
      this.position.y,
      this.position.z,
    ]);
  }
}

export default Static3DObject;
