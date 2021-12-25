import {mat4} from 'gl-matrix';
import {OBJ} from 'webgl-obj-loader';
import InputController from './InputController';
import Player from './models/Player';
import {fsSource, loadShader, vsSource} from './shader';
import {
  ApplicationAnimatedMeshesInfo,
  ApplicationAttributeLocations,
  ApplicationMeshesInfo,
  ApplicationTexturesInfo,
  ApplicationUniformLocations,
  CreateBufferResult
} from './type';
import Animated3DObject from './models/Animated3DObject';
import {animatedMeshAssets, staticMeshAssets, textureAssets} from './config';
import Static3DObject from './models/Static3DObject';
import isPowerOf2 from './utils/isPowerOf2';

class Application {

  private readonly _player: Player;
  private readonly _inputController: InputController | null = null;
  private readonly _gl: WebGL2RenderingContext | null = null;
  private readonly _shaderProgram: WebGLProgram | null = null;
  private _attribLocations: ApplicationAttributeLocations | null = null;
  private _uniformLocations: ApplicationUniformLocations | null = null;
  private _staticMeshes: ApplicationMeshesInfo = staticMeshAssets;
  private _animatedMeshes: ApplicationAnimatedMeshesInfo = animatedMeshAssets;
  private _textures: ApplicationTexturesInfo = textureAssets;
  private _objects: Static3DObject[] = [];
  private _currentTime = 0;

  constructor() {
    this._inputController = new InputController();
    this._player = new Player();

    const canvas = document.getElementById(
      'glCanvas') as unknown as HTMLCanvasElement;

    if (!canvas) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '100';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.onclick = this._inputController.requestLockPointer;

    if (!canvas) {
      return;
    }

    this._gl = canvas.getContext('webgl2');

    if (!this._gl) {
      return;
    }

    this.loadMeshes();
    this.loadTextures();
    this._shaderProgram = this.initShaderProgram(vsSource, fsSource);

    if (!this._shaderProgram) {
      return;
    }

    this._attribLocations = {
      vertexPosition: this._gl.getAttribLocation(
        this._shaderProgram,
        'aVertexPosition'
      ),
      textureCoord: this._gl.getAttribLocation(
        this._shaderProgram,
        'aTextureCoord'
      ),
      vertexNormal: this._gl.getAttribLocation(
        this._shaderProgram,
        'aVertexNormal'
      ),
    };

    this._uniformLocations = {
      projectionMatrix: this._gl.getUniformLocation(
        this._shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: this._gl.getUniformLocation(
        this._shaderProgram,
        'uModelViewMatrix'
      ),
      normalMatrix: this._gl.getUniformLocation(
        this._shaderProgram,
        'uNormalMatrix'
      ),
      uSampler: this._gl.getUniformLocation(this._shaderProgram, 'uSampler'),
    };
  }

  get inputController(): InputController | null {
    return this._inputController;
  }

  get player(): Player {
    return this._player;
  }

  public addNewObject(newObject: Static3DObject) {
    this._objects.push(newObject)
  }

  public removeObject(uuid: string) {
    this._objects = this._objects.filter(o => o.id !== uuid)
  }

  public getObjectById(id: string) {
    return this._objects.find(o => o.id === id);
  }

  public getObjectsByMeshName<T>(meshName: string) {
    return this._objects.filter(t => t.mesh === meshName) as unknown as T[]
  }

  initShaderProgram(vsSource: string, fsSource: string) {
    const gl = this._gl;

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
    Object.keys(this._staticMeshes).map((key) => {
      m[key] = this._staticMeshes[key].path;
    });
    Object.keys(this._animatedMeshes).map((key) => {
      const mesh = this._animatedMeshes[key];
      for (let i = 1; i <= mesh.frames; i++) {
        m[key + '_' + i] = mesh.path + '/' + i + '.obj';
      }
    });
    OBJ.downloadMeshes(
      m,
      (res) => {
        Object.keys(this._staticMeshes).map((key) => {
          const mesh = res[key];
          this._staticMeshes[key].mesh = res[key];
          this._staticMeshes[key].metaData = {
            position: mesh.vertices,
            indices: mesh.indices,
            textureCoord: mesh.textures,
            normal: mesh.vertexNormals
          };
          this._staticMeshes[key].buffers = this.createBuffers(
            mesh.vertices,
            mesh.indices,
            mesh.textures,
            mesh.vertexNormals
          );
        });
        Object.keys(this._animatedMeshes).map((key) => {
          const mesh = this._animatedMeshes[key];
          for (let i = 1; i <= mesh.frames; i++) {
            const r = res[key + '_' + i];
            if (!mesh.meshes) mesh.meshes = [];
            this._animatedMeshes[key]?.meshes?.push({
              mesh: r,
              metaData: {
                position: r.vertices,
                indices: r.indices,
                textureCoord: r.textures,
                normal: r.vertexNormals
              },
              buffers: this.createBuffers(
                r.vertices,
                r.indices,
                r.textures,
                r.vertexNormals
              )
            });
          }
        });
      },
      {}
    );
  }

  loadTextures() {
    Object.keys(this._textures).map((key) => {
      const t = this._textures[key];
      const gl = this._gl;

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
    const gl = this._gl;

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
    const deltaTime = now - this._currentTime;
    this._currentTime = now;

    const fpsElement = document.getElementById("fps")
    if (fpsElement) fpsElement.innerHTML = "FPS: " + Math.round(1 / deltaTime);

    const gl = this._gl;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    gl.clearColor(0.5, 0.6, 1, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this._player.onNextTick)
      this._player.onNextTick(deltaTime);

    const pm = this._player.getProjectionMatrix(gl);

    this._objects.map((obj) => {
      if (obj.onNextTick) obj.onNextTick(deltaTime);
    });

    this._objects.map((obj) => {
      this._drawObject(obj, pm);
    });

    requestAnimationFrame(this.render.bind(this));
  }

  private _drawObject(obj: Static3DObject | Animated3DObject, projectionMatrix: mat4) {
    const {_gl, _attribLocations, _uniformLocations, _shaderProgram} = this;

    if (!_gl) {
      console.error('WebGL not supported');
      return;
    }

    if (!_attribLocations || !_uniformLocations || !_shaderProgram) {
      return;
    }

    let mesh;

    if (obj instanceof Animated3DObject) {
      const m = this._animatedMeshes[obj.mesh];
      if (!m) return;
      if (!m.meshes) return;
      mesh = m.meshes[obj.animationFrame - 1];
    } else {
      mesh = this._staticMeshes[obj.mesh];
    }

    if (!mesh) return;

    const {buffers} = mesh;

    if (!buffers) return;

    // calculate the ModelViewMatrix from object
    const modelViewMatrix = mat4.create();
    obj.multiplyTranslateMatrix(modelViewMatrix);
    obj.multiplyRotationMatrix(modelViewMatrix);
    obj.multiplyScaleMatrix(modelViewMatrix);

    {
      const numComponents = 3;
      const type = _gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.position);
      _gl.vertexAttribPointer(
        _attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      _gl.enableVertexAttribArray(_attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
    _gl.useProgram(_shaderProgram);

    // Set the shader uniforms
    _gl.uniformMatrix4fv(
      _uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    _gl.uniformMatrix4fv(
      _uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.scale(normalMatrix, normalMatrix, obj.scale)
    mat4.transpose(normalMatrix, normalMatrix);
    _gl.uniformMatrix4fv(_uniformLocations.normalMatrix, false, normalMatrix);


    // tell webgl how to pull out the texture coordinates from buffer
    if (mesh.metaData && mesh.metaData.textureCoord.length > 0) {
      console.log(mesh)
      const num = 2;
      const type = _gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.textureCoord);
      _gl.vertexAttribPointer(
        _attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset
      );
      _gl.enableVertexAttribArray(_attribLocations.textureCoord);
    }

    // Tell WebGL how to pull out the normals from
    // the normal buffer into the vertexNormal attribute.
    {
      const numComponents = 3;
      const type = _gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.normal);
      _gl.vertexAttribPointer(
        _attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
      _gl.enableVertexAttribArray(_attribLocations.vertexNormal);
    }

    // Tell WebGL we want to affect texture unit 0
    _gl.activeTexture(_gl.TEXTURE0);

    // Bind the texture to texture unit 0
    const texture = this._textures[obj.texture].texture;
    if (texture && mesh.metaData && mesh.metaData.textureCoord.length > 0)
      _gl.bindTexture(_gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    _gl.uniform1i(_uniformLocations.uSampler, 0);

    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    {
      const indexCount = mesh.metaData?.indices.length || 0;
      const type = _gl.UNSIGNED_INT;
      const offset = 0;
      _gl.drawElements(_gl.TRIANGLES, indexCount, type, offset);
    }
  }
}

export default Application;
