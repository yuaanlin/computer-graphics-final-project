import Application from './Application';
import './styles/index.css';
import {handlePlayerWalking, PlayerStateCode} from "./models/Player";
import sendPopMessage from "./utils/sendPopMessage";
import MineCart, {WheelDirection} from "./models/Minecart";
import Meadow from "./models/Meadow";
import Grass from "./models/Grass";
import getDistance from "./utils/getDistance";
import Zombie from "./models/Zombie";
import Animated3DObject from "./models/Animated3DObject";

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  setTimeout(() => {
    sendPopMessage("小提示", '使用 WASD 键移动玩家，鼠标控制视角', 5)
  }, 1000)

  prepareScene(app)

  const g = new Grass(app);
  app.addNewObject(g);

  setInterval(() => {
    const z = new Zombie(app)
    z.position.z = Math.random() * 100 - 50;
    z.position.y = 1;
    z.position.x = Math.random() * 100 - 50;
    app.addNewObject(z)
  }, 3000)

  // Handling user input
  const {player, inputController} = app;
  if (!player || !inputController) return;

  const minecart = new MineCart(player, app);
  app.addNewObject(minecart);
  minecart.position.x = 5;
  minecart.position.z = -30;

  player.position.x = 0
  player.position.y = 2
  player.position.z = 0

  const a = new Animated3DObject('cone', 'car', app);
  app.addNewObject(a)
  let b = 0;
  a.onNextTick = (t) => {
    const oldB = b;
    b += t;
    if (Math.round(b * 10) !== Math.round(oldB * 10)) {
      a.animationFrame = ((a.animationFrame + 1) % 3) + 1;
    }
  };
  a.position.x = 10;

  inputController.registerKeyDownEvent({
    key: 'f', event: () => {
      switch (player.state.code) {
        case PlayerStateCode.DRIVING:
          player.position.y = 2;
          player.state = {
            code: PlayerStateCode.WALKING,
          }
          break
        case PlayerStateCode.WALKING:
          player.state = {
            code: PlayerStateCode.DRIVING,
            vehicleId: minecart.id
          }
          break
      }
    }
  })

  player.onNextTick = (deltaTime) => {

    if (!inputController) return;

    if (!player.hasSawVehicle && getDistance(minecart.position, player.position) < 5) {
      player.hasSawVehicle = true;
      sendPopMessage('你发现了一辆矿车！', '使用 F 键驾驶矿车', 5)
    }

    if (player.state.code === PlayerStateCode.WALKING) {
      handlePlayerWalking(player, inputController, deltaTime)
    }

    if (player.state.code === PlayerStateCode.DRIVING) {
      const vehicle = app.getObjectById(player.state.vehicleId) as unknown as MineCart;

      if (!vehicle) {
        player.state = {code: PlayerStateCode.WALKING};
        return
      }

      if (inputController.isKeyPressed('w'))
        vehicle.speedUp(40 * deltaTime);

      if (inputController.isKeyPressed('s'))
        vehicle.speedUp(-40 * deltaTime);

      vehicle.turnAround(WheelDirection.CENTER)

      if (inputController.isKeyPressed('a'))
        vehicle.turnAround(WheelDirection.LEFT)

      if (inputController.isKeyPressed('d'))
        vehicle.turnAround(WheelDirection.RIGHT)

      player.setPosition({
        x: vehicle.position.x,
        y: .8,
        z: vehicle.position.z
      })
    }
  }
}

function prepareScene(app: Application) {

  // 八个围绕场景的大型草地方块（暂时性装饰）
  const bigGrassBlocks: Grass[] = [];
  for (let i = 0; i < 8; i++) {
    bigGrassBlocks.push(new Grass(app));
    bigGrassBlocks[i].scale = [10, 10, 10]
    app.addNewObject(bigGrassBlocks[i])
  }
  bigGrassBlocks[0].position = {x: 80, y: 0, z: 0}
  bigGrassBlocks[1].position = {x: -80, y: 0, z: 0}
  bigGrassBlocks[2].position = {x: 0, y: 0, z: 80}
  bigGrassBlocks[3].position = {x: 0, y: 0, z: -80}
  bigGrassBlocks[4].position = {x: 80, y: 0, z: -80}
  bigGrassBlocks[5].position = {x: -80, y: 0, z: 80}
  bigGrassBlocks[6].position = {x: 80, y: 0, z: 80}
  bigGrassBlocks[7].position = {x: -80, y: 0, z: -80}

  // 大草地（场景地面）
  const meadow = new Meadow(app);
  app.addNewObject(meadow);
}