interface KeyEvent {
  key: string
  event: () => void
}

export default class InputController {
  onMouseMove: ((moveX: number, moveY: number) => void) | undefined = undefined;
  private readonly _pressedKeys: { [key: string]: boolean | undefined };
  private _keyDownEvent: KeyEvent[];
  private _keyUpEvent: KeyEvent[];
  private _isPointerLocked = false;

  constructor() {
    this._pressedKeys = {};
    this._keyDownEvent = [];
    this._keyUpEvent = [];
    document.addEventListener('keydown', this._handleKeyDown.bind(this), false);
    document.addEventListener('keyup', this._handleKeyUp.bind(this), false);
    document.addEventListener('mousemove',
      this._handleMouseMove.bind(this), false);
    document.addEventListener('pointerlockchange',
      this._handlePointerLockChange.bind(this), false);
  }

  public requestLockPointer() {
    const canvas = document.getElementById('glCanvas');

    if (!canvas) {
      console.warn('No canvas element find, lock pointer failed.');
      return;
    }

    canvas.requestPointerLock();
  }

  public registerKeyDownEvent(ke: KeyEvent) {
    this._keyDownEvent.push(ke);
  }

  public registerKeyUpEvent(ke: KeyEvent) {
    this._keyUpEvent.push(ke);
  }

  public isKeyPressed(key: string) {
    return !!this._pressedKeys[key];
  }

  private _handlePointerLockChange() {
    this._isPointerLocked = !this._isPointerLocked;
  }

  private _handleMouseMove(ev: MouseEvent) {
    if (this._isPointerLocked && this.onMouseMove) {
      var movementX = ev.movementX;
      var movementY = ev.movementY;
      this.onMouseMove(movementX, movementY);
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    this._pressedKeys[e.key.toLowerCase()] = true;
    this._keyDownEvent.map(kde => {
      if (e.key === kde.key) kde.event();
    });
  }

  private _handleKeyUp(e: KeyboardEvent) {
    this._pressedKeys[e.key.toLowerCase()] = false;
    this._keyUpEvent.map(kue => {
      if (e.key === kue.key) kue.event();
    });
  }
}