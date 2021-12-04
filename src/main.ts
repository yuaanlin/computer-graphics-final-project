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

    // When press "W" key, player move forward
    if(inputController.isKeyPressed('w'))
      player.setPosition({z: player.positionZ + (deltaTime * player.moveSpeed)})

    // When press "S" key, player move forward
    if(inputController.isKeyPressed('s'))
      player.setPosition({z: player.positionZ - (deltaTime * player.moveSpeed)})

    // When press "A" key, player move forward
    if(inputController.isKeyPressed('a'))
      player.setPosition({x: player.positionX + (deltaTime * player.moveSpeed)})

    // When press "D" key, player move forward
    if(inputController.isKeyPressed('d'))
      player.setPosition({x: player.positionX - (deltaTime * player.moveSpeed)})

    // for debug camera rotation without mose input
    if(inputController.isKeyPressed('q'))
      player.setRotation({w: player.rotationRadius - .01})

    // for debug camera rotation without mose input
    if(inputController.isKeyPressed('e'))
      player.setRotation({w: player.rotationRadius + .01})
  }

  app.addNewObject(obj);
}
