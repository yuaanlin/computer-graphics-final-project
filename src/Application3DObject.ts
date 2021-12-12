import { Position, Rotation } from './type';

class Application3DObject {
  id: string;
  mesh: string;
  texture: string;
  position: Position;
  rotation: EulerAngles;
  onNextTick: ((deltaTime: number) => void) | undefined;

  constructor(meshName: string, textureName: string) {
    this.id = '';
    this.mesh = meshName;
    this.texture = textureName;
    this.position = {x: 0, y: 0, z: -10};
    this.rotation = {yaw: 0, pitch: 0, roll: 0};
  }
}

export default Application3DObject;
