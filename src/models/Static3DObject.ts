import {EulerAngles, Position} from '../type';
import {ReadonlyVec3} from 'gl-matrix';
import uuid from "../utils/uuid";

class Static3DObject {
  id: string;
  mesh: string;
  texture: string;
  position: Position;
  anchorPoint: Position;
  rotation: EulerAngles;
  scale: ReadonlyVec3;
  onNextTick: ((deltaTime: number) => void) | undefined;

  constructor(meshName: string, textureName: string) {
    this.id = uuid();
    this.mesh = meshName;
    this.texture = textureName;
    this.scale = [1, 1, 1];
    this.position = {x: 0, y: 0, z: 0};
    this.rotation = {yaw: 0, pitch: 0, roll: 0};
    this.anchorPoint = {x: 0, y: 0, z: 0};
  }
}

export default Static3DObject;
