interface KeyEvent {
    key: string
    event: () => void
}

export default class InputController {
    private readonly _pressedKeys: {[key: string]: boolean | undefined};
    private _keyDownEvent: KeyEvent[];
    private _keyUpEvent: KeyEvent[];

    constructor() {
        this._pressedKeys = {};
        this._keyDownEvent = [];
        this._keyUpEvent = []
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
        document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
    }

    public registerKeyDownEvent(ke: KeyEvent) {
        this._keyDownEvent.push(ke)
    }

    public registerKeyUpEvent(ke: KeyEvent) {
        this._keyUpEvent.push(ke)
    }

    public isKeyPressed(key: string) {
        return !!this._pressedKeys[key];
    }

    private handleKeyDown(e: KeyboardEvent) {
       this._pressedKeys[e.key] = true;
       this._keyDownEvent.map(kde => {
           if(e.key === kde.key) kde.event();
       })
    }

    private handleKeyUp(e: KeyboardEvent) {
        this._pressedKeys[e.key] = false;
        this._keyUpEvent.map(kue => {
            if(e.key === kue.key) kue.event();
        })
    }
}