import Application from './Application';
import Application3DObject from './Application3DObject';
import './index.css';

window.onload = main;

function main() {
  const app = new Application();
  app.run();

  const obj = new Application3DObject('bunny', 'bunny');
  obj.onNextTick = (deltaTime) => {
    obj.rotation.z += deltaTime * 0.01;
  };

  app.addNewObject(obj);
}
