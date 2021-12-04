import { Position, Rotation } from './type';

class Application3DObject {
  id: string;
  mesh: string;
  texture: string;
  position: Position;
  rotation: Rotation;
  onNextTick: ((deltaTime: number) => void) | undefined;

  constructor(meshName: string, textureName: string) {
    this.id = '';
    this.mesh = meshName;
    this.texture = textureName;
    this.position = { x: 0, y: 0, z: -10 };
    this.rotation = { x: 0, y: 1, z: 0, w: 0 };
  }
}

export default Application3DObject;
