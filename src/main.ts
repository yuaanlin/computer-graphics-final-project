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

  obj.onNextTick = (v) => {
    obj.rotation.roll += v
    obj.rotation.yaw += v
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
      }
    }

    // When press "W" key, player move forward
    if (inputController.isKeyPressed('w'))
      player.setPosition({
        x: player.positionX + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
      })

    // When press "S" key, player move backward 
    if (inputController.isKeyPressed('s'))
      player.setPosition({
        x: player.positionX - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime
      })

    // When press "A" key, player move left 
    if (inputController.isKeyPressed('a'))
      player.setPosition({
        x: player.positionX + Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ - Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
      })

    // When press "D" key, player move right 
    if (inputController.isKeyPressed('d'))
      player.setPosition({
        x: player.positionX - Math.cos(player.rotation.pitch) * player.moveSpeed * deltaTime,
        z: player.positionZ + Math.sin(player.rotation.pitch) * player.moveSpeed * deltaTime
      })
  }

}
