import {Position, Rotation} from "./type";
import {ReadonlyVec3} from "gl-matrix";

export default class Player {
    onNextTick: ((deltaTime: number) => void) | undefined;
    private _position: Position;
    private _rotation: Rotation;

    constructor() {
        this._moveSpeed = 10;
        this._position = {x: 0, y:0, z:0}
        this._rotation = {x:0,y:1, z:0, w:0}
    }

    private _moveSpeed: number;

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    set moveSpeed(value: number) {
        this._moveSpeed = value;
    }

    get positionVec3(): ReadonlyVec3 {
        return [this._position.x, this._position.y, this._position.z]
    }

    get rotationRadius(): number {
        return this._rotation.w;
    }

    get rotationAxis(): ReadonlyVec3 {
        return [this._rotation.x, this._rotation.y, this._rotation.z]
    }

    get positionX(): number {
        return this._position.x;
    }

    get positionY(): number {
        return this._position.y;
    }

    get positionZ(): number{
        return this._position.z;
    }

    public setRotation(rot: {x?: number, y?:number, z?:number, w?: number}) {
        if(rot.x) this._rotation.x = rot.x;
        if(rot.y) this._rotation.y = rot.y;
        if(rot.z) this._rotation.z = rot.z;
        if(rot.w) this._rotation.w = rot.w;
    }

    public setPosition(pos: {x?: number, y?:number, z?:number}) {
        if(pos.x) this._position.x = pos.x;
        if(pos.y) this._position.y = pos.y;
        if(pos.z) this._position.z = pos.z;
    }

}

