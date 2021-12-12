import Application from './Application';
import './styles/index.css';
import Static3DObject from './models/Static3DObject';
import static3DObject from './models/Static3DObject';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  const minecart = new MineCart();
  app.addNewObject(minecart);
  minecart.position.y = 1;

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 30; j++) {
      const g = new Grass();
      g.position.x = i;
      g.position.z = j;
      app.addNewObject(g);
    }
  }

  // Handling user input
  const { player, inputController } = app;

  player.onNextTick = (deltaTime) => {

    if (!inputController) return;

    // When mouse move, rotate the camera
    inputController.onMouseMove = (x, y) => {
      player.rotation = {
        yaw: player.rotation.yaw,
        pitch: player.rotation.pitch - x * .001,
        roll: player.rotation.roll - y * .001
      };
    };

    // When press "W" key, player move forward
    if (inputController.isKeyPressed('w'))
      player.setPosition({
        x: player.positionX + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
      });

    if (inputController.isKeyPressed(' '))
      player.setPosition({
        x: player.positionX,
        y: player.positionY - .1,
        z: player.positionZ
      });

    if (inputController.isKeyPressed('x'))
      player.setPosition({
        x: player.positionX,
        y: player.positionY + .1,
        z: player.positionZ
      });

    // When press "S" key, player move backward
    if (inputController.isKeyPressed('s'))
      player.setPosition({
        x: player.positionX - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
      });

    // When press "A" key, player move left
    if (inputController.isKeyPressed('a'))
      player.setPosition({
        x: player.positionX + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
      });

    // When press "D" key, player move right
    if (inputController.isKeyPressed('d'))
      player.setPosition({
        x: player.positionX - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
      });
  };

}

class Grass extends Static3DObject {
  constructor() {
    super('grass', 'grass');
    this.scale = [0.5, 0.5, 0.5];
  }
}

class MineCart extends static3DObject {
  constructor() {
    super('minecart', 'minecart');
    this.scale = [1, 1, 1];
  }
}