import Application from './Application';
import Application3DObject from './Application3DObject';
import './index.css';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  const obj = new Application3DObject('bunny', 'bunny');

  const {player, inputController} = app;
  player.onNextTick = (deltaTime) => {
    if(inputController.isKeyPressed('w')) {
      player.setPosition({z: player.positionZ + (deltaTime * player.moveSpeed)})
    }
    if(inputController.isKeyPressed('s')) {
      player.setPosition({z: player.positionZ - (deltaTime * player.moveSpeed)})
    }
    if(inputController.isKeyPressed('a')) {
      player.setPosition({x: player.positionX + (deltaTime * player.moveSpeed)})
    }
    if(inputController.isKeyPressed('d')) {
      player.setPosition({x: player.positionX - (deltaTime * player.moveSpeed)})
    }
    if(inputController.isKeyPressed('q')) {
      player.setRotation({w: player.rotationRadius - .01})
    }
    if(inputController.isKeyPressed('e')) {
      player.setRotation({w: player.rotationRadius + .01})
    }
  }

  app.addNewObject(obj);
}
