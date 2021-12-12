import { EulerAngles, Position } from '../type';

class Animated3DObject {
  id: string;
  mesh: string;
  texture: string;
  position: Position;
  rotation: EulerAngles;
  onNextTick: ((deltaTime: number) => void) | undefined;
  animationFrame: number;

  constructor(meshName: string, textureName: string) {
    this.id = '';
    this.mesh = meshName;
    this.texture = textureName;
    this.position = { x: 0, y: 0, z: -10 };
    this.rotation = { pitch: 0, roll: 1, yaw: 0 };
    this.animationFrame = 1;
  }
}

export default Animated3DObject;
