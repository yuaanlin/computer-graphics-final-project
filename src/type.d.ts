import { Mesh } from 'webgl-obj-loader';

type CreateBufferResult = {
  position: WebGLBuffer | null;
  indices: WebGLBuffer | null;
  textureCoord: WebGLBuffer | null;
  normal: WebGLBuffer | null;
};

type ApplicationMeshesInfo = {
  [key: string]: {
    path: string;
    mesh: Mesh | null;
    buffers: CreateBufferResult | null;
  };
};

type ApplicationTexturesInfo = {
  [key: string]: {
    path: string;
    texture: WebGLTexture | null;
  };
};

type ApplicationUniformLocations = {
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
  normalMatrix: WebGLUniformLocation | null;
  uSampler: WebGLUniformLocation | null;
};

type ApplicationAttributeLocations = {
  vertexPosition: number;
  textureCoord: number;
  vertexNormal: number;
};

type Position = {
  x: number;
  y: number;
  z: number;
};

type Rotation = {
  x: number;
  y: number;
  z: number;
  w: number;
};
