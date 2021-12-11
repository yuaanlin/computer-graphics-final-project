import Application from './Application';
import Application3DObject from './Application3DObject';
import './index.css';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  // add a bunny to world
  const obj = new Application3DObject('bunny', 'bunny');
  app.addNewObject(obj);

  // Handling user input
  const { player, inputController } = app;

  player.onNextTick = (deltaTime) => {

    if (!inputController) return;

    // When mouse move, rotate the camera
    inputController.onMouseMove = (x, y) => {
      player.setRotation({ w: player.rotationRadius + x * .001 })
      console.log('Mouse move! delta X is ', x, ', delta Y is', y)
    }

    // When press "W" key, player move forward
    if (inputController.isKeyPressed('w'))
      player.setPosition({ z: player.positionZ + (deltaTime * player.moveSpeed) })

    // When press "S" key, player move backward 
    if (inputController.isKeyPressed('s'))
      player.setPosition({ z: player.positionZ - (deltaTime * player.moveSpeed) })

    // When press "A" key, player move left 
    if (inputController.isKeyPressed('a'))
      player.setPosition({ x: player.positionX + (deltaTime * player.moveSpeed) })

    // When press "D" key, player move right 
    if (inputController.isKeyPressed('d'))
      player.setPosition({ x: player.positionX - (deltaTime * player.moveSpeed) })
  }

}
