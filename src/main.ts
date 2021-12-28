import Application from './Application';
import './styles/index.css';
import {handlePlayerWalking, PlayerStateCode} from "./models/Player";
import MineCart, {WheelDirection} from "./models/Minecart";
import Meadow from "./models/Meadow";
import Grass from "./models/Grass";
import getDistance from "./utils/getDistance";
import Zombie from "./models/Zombie";
import Steroid from "./models/Steroid";
import getEulerAngleFromVec3 from "./utils/eulerAngleFromVec3";
import {STEROID_INTERVAL, STEROID_START_COUNT} from "./config";

window.onload = main;

function main() {
  let isGameEnded = false;

  const app = new Application();
  app.run();

  setTimeout(() => {
    app.sendPopMessage("小提示", '使用 WASD 键移动玩家，鼠标控制视角', 5)
  }, 1000)

  prepareScene(app)

  setInterval(() => {
    const z = new Zombie(app)
    z.position.z = Math.random() * 100 - 50;
    z.position.y = 2;
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

  inputController.registerKeyDownEvent({
    key: 'n', event: () => {
      app.currentSelectLight = app.currentSelectLight === 'DAY' ? 'NIGHT' : 'DAY'
    }
  })

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
          if (getDistance(player.position, minecart.position) < 5) {
            player.state = {
              code: PlayerStateCode.DRIVING,
              vehicleId: minecart.id
            }
          }
          break
      }
    }
  })

  player.onNextTick = (deltaTime) => {

    if (!inputController) return;

    if (player.position.y < -10 && !isGameEnded) {
      isGameEnded = true;
      if (confirm('游戏结束！你总共杀死了 ' + app.killedZombieCount + '只僵尸, 要再挑战一次吗？')) {
        window.location.reload()
      }
      return;
    }

    if (!player.hasSawVehicle && getDistance(minecart.position, player.position) < 5) {
      player.hasSawVehicle = true;
      app.sendPopMessage('你发现了一辆矿车！', '使用 F 键驾驶矿车', 5)
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
        y: vehicle.position.y + .8,
        z: vehicle.position.z
      })
    }
  }
}

function prepareScene(app: Application) {

  // 八个围绕场景的大型草地方块（暂时性装饰）
  const bigGrassBlocks: Grass[] = [];
  const giantZombies: Zombie[] = [];
  for (let i = 0; i < 8; i++) {
    bigGrassBlocks.push(new Grass(app));
    bigGrassBlocks[i].scale = [10, 10, 10]
    app.addNewObject(bigGrassBlocks[i])
    giantZombies.push(new Zombie(app))
    giantZombies[i].scale = [1, 1, 1]
    app.addNewObject(giantZombies[i])
  }
  bigGrassBlocks[0].position = {x: 120, y: -20, z: 0}
  giantZombies[0].position = {x: 120, y: 15, z: 0}
  giantZombies[0].rotation.pitch = 3.14 / 2

  bigGrassBlocks[1].position = {x: -120, y: -20, z: 0}
  giantZombies[1].position = {x: -120, y: 15, z: 0}
  giantZombies[1].rotation.pitch = -3.14 / 2

  bigGrassBlocks[2].position = {x: 0, y: -20, z: 120}
  giantZombies[2].position = {x: 0, y: 15, z: 120}
  giantZombies[2].rotation.pitch = 3.14 / 2

  bigGrassBlocks[3].position = {x: 0, y: -20, z: -120}
  giantZombies[3].position = {x: 0, y: 15, z: -120}
  giantZombies[3].rotation.pitch = -3.14 / 2

  bigGrassBlocks[4].position = {x: 120, y: -20, z: -120}
  giantZombies[4].position = {x: 120, y: 15, z: -120}
  giantZombies[4].rotation.pitch = -3.14 / 4

  bigGrassBlocks[5].position = {x: -120, y: -20, z: 120}
  giantZombies[5].position = {x: -120, y: 15, z: 120}
  giantZombies[5].rotation.pitch = -3.14 / 4

  bigGrassBlocks[6].position = {x: 120, y: -20, z: 120}
  giantZombies[6].position = {x: 120, y: 15, z: 120}
  giantZombies[6].rotation.pitch = 3.14 / 4

  bigGrassBlocks[7].position = {x: -120, y: -20, z: -120}
  giantZombies[7].position = {x: -120, y: 15, z: -120}
  giantZombies[7].rotation.pitch = -3.14 / 4

  giantZombies.map((gz, i) => {
    setTimeout(() => {
      setInterval(() => {
        if (app.killedZombieCount >= STEROID_START_COUNT) {
          const direction = getEulerAngleFromVec3([
            app.player.position.x - gz.position.x,
            app.player.position.y - gz.position.y - 20,
            app.player.position.z - gz.position.z]);
          const s = new Steroid(app, direction)
          s.position = {...gz.position};
          app.addNewObject(s)
        }
      }, STEROID_INTERVAL)
    }, i * 2000)
  })

  // 大草地（场景地面）
  const meadow = new Meadow(app);
  app.addNewObject(meadow);
}