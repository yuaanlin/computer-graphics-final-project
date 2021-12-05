import Application from './Application';
import Application3DObject from './Application3DObject';
import './index.css';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  const obj = new Application3DObject('bunny', 'bunny');

  const { player, inputController } = app;

  if (inputController)
    inputController.onMouseMove = (x, y) => {
      player.setRotation({ w: player.rotationRadius + x * .001 })
    }

  player.onNextTick = (deltaTime) => {

    if (!inputController) return;

    // When press "W" key, player move forward
    if (inputController.isKeyPressed('w'))
      player.setPosition({ z: player.positionZ + (deltaTime * player.moveSpeed) })

    // When press "S" key, player move forward
    if (inputController.isKeyPressed('s'))
      player.setPosition({ z: player.positionZ - (deltaTime * player.moveSpeed) })

    // When press "A" key, player move forward
    if (inputController.isKeyPressed('a'))
      player.setPosition({ x: player.positionX + (deltaTime * player.moveSpeed) })

    // When press "D" key, player move forward
    if (inputController.isKeyPressed('d'))
      player.setPosition({ x: player.positionX - (deltaTime * player.moveSpeed) })
  }

  app.addNewObject(obj);
}
