export const staticMeshAssets = {
  minecart: {path: 'assets/static_meshes/minecart.obj'},
  car: {path: 'assets/static_meshes/car.obj'},
  grass: {path: 'assets/static_meshes/grass.obj'},
  bigGrass: {path: 'assets/static_meshes/big_grass.obj'},
  zombie: {path: 'assets/static_meshes/zombie.obj'},
};

export const animatedMeshAssets = {
  cone: {
    path: 'assets/animated_meshes/cone',
    frames: 4
  },
  steroid: {
    path: 'assets/animated_meshes/steroid',
    frames: 5
  }
};

export const textureAssets = {
  minecart: {path: 'assets/textures/minecart.png'},
  car: {path: 'assets/textures/car.png'},
  grass: {path: 'assets/textures/grass.png'},
  zombie: {path: 'assets/textures/zombie.png'},
};

export const VEHICLE_MAX_SPEED = 10;
export const VEHICLE_MAX_ACCELERATION = 10;
export const GRAVITY_ACCELERATION = 9.8;

/** 僵尸巨人对玩家扔出的巨型泥土块的基本速度（实际速度会再加上玩家当前杀死僵尸的数量） */
export const STEROID_SPEED = 2;

/** 杀死特定数量的僵尸后，将出现僵尸巨人对玩家扔出巨型泥土块 */
export const STEROID_START_COUNT = 1;

/** 同一只僵尸巨人扔出泥土块的冷却时间 */
export const STEROID_INTERVAL = 8000;