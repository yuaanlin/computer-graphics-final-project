import Application from './Application';
import './index.css';

window.onload = main;

function main() {
  const app = new Application();
  app.run();
}
