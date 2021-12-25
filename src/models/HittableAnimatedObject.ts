import {ReadonlyVec2} from "gl-matrix";
import Application from "../Application";
import Animated3DObject from "./Animated3DObject";
import HittableObject from "./HittableObject";

class HittableAnimatedObject extends Animated3DObject {

  constructor(meshName: string, textureName: string, app: Application) {
    super(meshName, textureName, app);
  }

  protected _xEdge = 1;

  get xEdge(): number {
    return this._xEdge;
  }

  protected _yEdge = 1;

  get yEdge(): number {
    return this._yEdge;
  }

  protected _zEdge = 1;

  get zEdge(): number {
    return this._zEdge;
  }

  public onHit(_obj: HittableObject | HittableAnimatedObject) {
  }

  public isHit(obj: HittableObject | HittableAnimatedObject): boolean {
    const xRange1: ReadonlyVec2 = [obj.position.x - obj.xEdge, obj.position.x + obj.xEdge];
    const xRange2: ReadonlyVec2 = [this.position.x - this.xEdge, this.position.x + this.xEdge];
    if (!isRangeCovered(xRange1, xRange2)) return false
    const yRange1: ReadonlyVec2 = [obj.position.y - obj.yEdge, obj.position.y + obj.yEdge];
    const yRange2: ReadonlyVec2 = [this.position.y - this.yEdge, this.position.y + this.yEdge];
    if (!isRangeCovered(yRange1, yRange2)) return false
    const zRange1: ReadonlyVec2 = [obj.position.z - obj.zEdge, obj.position.z + obj.zEdge];
    const zRange2: ReadonlyVec2 = [this.position.z - this.zEdge, this.position.z + this.zEdge];
    return isRangeCovered(zRange1, zRange2);
  }
}

function isRangeCovered(range1: ReadonlyVec2, range2: ReadonlyVec2) {
  return !(range1[0] > range2[1] || range2[0] > range1[1])
}

export default HittableAnimatedObject