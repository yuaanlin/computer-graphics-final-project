import Application from './Application';
import './styles/index.css';
import Animated3DObject from './models/Animated3DObject';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  const a = new Animated3DObject('cone', 'bunny');
  app.addNewAnimatedObject(a);

  let b = 0;
  a.onNextTick = (t) => {
    const oldB = b;
    b += t;
    if (Math.round(b * 10) !== Math.round(oldB * 10)) {
      a.animationFrame = ((a.animationFrame + 1) % 3) + 1;
    }
    a.rotation.roll += t * 10;
  };

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
