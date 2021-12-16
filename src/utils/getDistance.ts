import {Position} from "../type";

function getDistance(p1: Position, p2: Position) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)
}

export default getDistance