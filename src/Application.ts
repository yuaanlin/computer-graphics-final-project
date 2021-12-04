import {mat4} from 'gl-matrix';
import { OBJ } from 'webgl-obj-loader';
import Application3DObject from './Application3DObject';
import InputController from './InputController';
import { fsSource, loadShader, vsSource } from './shader';
import {
  ApplicationAttributeLocations,
  ApplicationMeshesInfo,
  ApplicationTexturesInfo,
  ApplicationUniformLocations,
  CreateBufferResult,
} from './type';
import { isPowerOf2 } from './utils';
import Player from "./Player";

class Application {

  private readonly _player: Player;
  private readonly _inputController: InputController;
  private readonly gl: WebGL2RenderingContext | null = null;
  private readonly shaderProgram: WebGLProgram | null = null;
  private attribLocations: ApplicationAttributeLocations | null = null;
  private uniformLocations: ApplicationUniformLocations | null = null;
  private meshes: ApplicationMeshesInfo = {
    bunny: { path: 'assets/bunny.obj', mesh: null, buffers: null },
  };
  private textures: ApplicationTexturesInfo = {
    bunny: { path: 'assets/bunny_texture.jpg', texture: null },
  };
  private objects: Application3DObject[] = [];
  private currentTime = 0;

  constructor() {
    this._inputController = new InputController();
    this._player = new Player();
    const canvas = document.createElement('canvas');

    canvas.id = 'glCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '100';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const existingCanvas = document.getElementById(canvas.id);
    if (existingCanvas && existingCanvas.parentElement) {
      existingCanvas.parentElement.removeChild(existingCanvas);
    }

    if (!canvas) {
      return;
    }
    document.body.appendChild(canvas);

    this.gl = canvas.getContext('webgl2');

    if (!this.gl) {
      return;
    }

    this.loadMeshes();
    this.loadTextures();
    this.shaderProgram = this.initShaderProgram(vsSource, fsSource);

    if (!this.shaderProgram) {
      return;
    }

    this.attribLocations = {
      vertexPosition: this.gl.getAttribLocation(
        this.shaderProgram,
        'aVertexPosition'
      ),
      textureCoord: this.gl.getAttribLocation(
        this.shaderProgram,
        'aTextureCoord'
      ),
      vertexNormal: this.gl.getAttribLocation(
        this.shaderProgram,
        'aVertexNormal'
      ),
    };

    this.uniformLocations = {
      projectionMatrix: this.gl.getUniformLocation(
        this.shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: this.gl.getUniformLocation(
        this.shaderProgram,
        'uModelViewMatrix'
      ),
      normalMatrix: this.gl.getUniformLocation(
        this.shaderProgram,
        'uNormalMatrix'
      ),
      uSampler: this.gl.getUniformLocation(this.shaderProgram, 'uSampler'),
    };
  }

  get inputController(): InputController {
    return this._inputController;
  }

  get player(): Player {
    return this._player;
  }

  addNewObject(newObject: Application3DObject) {
    this.objects.push(newObject);
  }

  initShaderProgram(vsSource: string, fsSource: string) {
    const gl = this.gl;

    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();

    if (!shaderProgram || !vertexShader || !fragmentShader) {
      console.error('Unable to create shader program');
      return null;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        'Unable to initialize the shader program: ' +
          gl.getProgramInfoLog(shaderProgram)
      );
      return null;
    }

    return shaderProgram;
  }

  loadMeshes() {
    let m: { [key: string]: string } = {};
    Object.keys(this.meshes).map((key) => {
      m[key] = this.meshes[key].path;
    });
    OBJ.downloadMeshes(
      m,
      (res) => {
        Object.keys(this.meshes).map((key) => {
          const mesh = res[key];
          this.meshes[key].mesh = res[key];
          this.meshes[key].buffers = this.createBuffers(
            mesh.vertices,
            mesh.indices,
            mesh.indices,
            mesh.vertexNormals
          );
        });
      },
      {}
    );
  }

  loadTextures() {
    Object.keys(this.textures).map((key) => {
      const t = this.textures[key];
      const gl = this.gl;

      if (!gl) {
        console.error('WebGL not supported');
        return null;
      }

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 255, 255]);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
      );

      const image = new Image();

      image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          level,
          internalFormat,
          srcFormat,
          srcType,
          image
        );

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
      };

      image.src = t.path;

      t.texture = texture;
      return t;
    });
  }

  createBuffers(
    vertexPositions: number[],
    indices: number[],
    textureCoordinates: number[],
    vertexNormals: number[]
  ): CreateBufferResult | null {
    const gl = this.gl;

    if (!gl) {
      console.error('WebGL not supported');
      return null;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexPositions),
      gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint32Array(indices),
      gl.STATIC_DRAW
    );

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    );

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexNormals),
      gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
      indices: indexBuffer,
      textureCoord: textureCoordBuffer,
      normal: normalBuffer,
    };
  }

  run() {
    requestAnimationFrame(this.render.bind(this));
  }

  render(now: number) {
    now *= 0.001;
    const deltaTime = now - this.currentTime;
    this.currentTime = now;

    const gl = this.gl;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(this._player.onNextTick)
      this._player.onNextTick(deltaTime)

    this.objects.map((obj) => {
      if (obj.onNextTick) obj.onNextTick(deltaTime);
    });

    this.objects.map((obj) => {
      this.drawScene(obj);
    });

    requestAnimationFrame(this.render.bind(this));
  }

  drawScene(obj: Application3DObject) {
    const { gl, attribLocations, uniformLocations, shaderProgram } = this;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    if (!attribLocations || !uniformLocations || !shaderProgram) {
      return;
    }

    const { buffers } = this.meshes[obj.mesh];

    if (!buffers) return;

    const fieldOfView = (30 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 2000.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    mat4.translate(projectionMatrix, projectionMatrix, this._player.positionVec3)
    mat4.rotate(projectionMatrix, projectionMatrix, this._player.rotationRadius, this._player.rotationAxis)

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [
      obj.position.x,
      obj.position.y,
      obj.position.z,
    ]);

    mat4.rotate(modelViewMatrix, modelViewMatrix, obj.rotation.w, [
      obj.rotation.x,
      obj.rotation.y,
      obj.rotation.z,
    ]);

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(shaderProgram);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
      uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    // tell webgl how to pull out the texture coordinates from buffer
    {
      const num = 1;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(
        attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(attribLocations.textureCoord);
    }

    // Tell WebGL how to pull out the normals from
    // the normal buffer into the vertexNormal attribute.
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(
        attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      gl.enableVertexAttribArray(attribLocations.vertexNormal);
    }

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    const texture = this.textures[obj.texture].texture;
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(uniformLocations.uSampler, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    {
      const indexCount = 109314;
      const type = gl.UNSIGNED_INT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, indexCount, type, offset);
    }
  }
}

export default Application;
