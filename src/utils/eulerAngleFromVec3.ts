import {vec3} from "gl-matrix";
import {EulerAngles} from "../type";

export default function getEulerAngleFromVec3(vec: vec3): EulerAngles {
  const x = vec[0];
  const y = vec[1];
  const z = vec[2];
  return {
    roll: 0,
    pitch: Math.atan2(x * -1, z),
    yaw: Math.atan2(y, Math.sqrt(x ** 2 + z ** 2))
  }
}