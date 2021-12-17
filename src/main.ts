import Application from './Application';
import './styles/index.css';
import {handlePlayerWalking, PlayerStateCode} from "./models/Player";
import sendPopMessage from "./utils/sendPopMessage";
import MineCart, {WheelDirection} from "./models/Minecart";
import Meadow from "./models/Meadow";
import Grass from "./models/Grass";
import getDistance from "./utils/getDistance";
import Zombie from "./models/Zombie";

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  setTimeout(() => {
    sendPopMessage("小提示", '使用 WASD 键移动玩家，鼠标控制视角', 5)
  }, 1000)

  prepareScene(app)

  const g = new Grass();
  app.addNewObject(g);

  const z = new Zombie()
  z.position.y = 1.2;
  z.position.x = 5;
  app.addNewObject(z)

  // Handling user input
  const {player, inputController} = app;
  if (!player || !inputController) return;

  const minecart = new MineCart(player);
  app.addNewObject(minecart);
  minecart.position.x = 5;
  minecart.position.z = -30;

  player.position.x = 0
  player.position.y = 2
  player.position.z = 0

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
    bigGrassBlocks.push(new Grass());
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
  const meadow = new Meadow();
  app.addNewObject(meadow);
}