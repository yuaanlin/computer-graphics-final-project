import {Mesh} from 'webgl-obj-loader';

type CreateBufferResult = {
  position: WebGLBuffer | null;
  indices: WebGLBuffer | null;
  textureCoord: WebGLBuffer | null;
  normal: WebGLBuffer | null;
};

type ApplicationMeshesInfo = {
  [key: string]: {
    path: string;
    mesh?: Mesh;
    buffers?: CreateBufferResult | null;
    metaData?: {
      position: number[];
      indices: number[]
      textureCoord: number[]
      normal: number[]
    },
  };
};

type ApplicationAnimatedMeshesInfo = {
  [key: string]: {
    path: string;
    frames: number;
    meshes?: {
      mesh?: Mesh;
      buffers?: CreateBufferResult | null;
      metaData?: {
        position: number[];
        indices: number[]
        textureCoord: number[]
        normal: number[]
      },
    }[]
  };
};

type ApplicationTexturesInfo = {
  [key: string]: {
    path: string;
    texture?: WebGLTexture | null;
  };
};

type ApplicationUniformLocations = {
  projectionMatrix: WebGLUniformLocation | null;
  modelViewMatrix: WebGLUniformLocation | null;
  normalMatrix: WebGLUniformLocation | null;
  lightDirection: WebGLUniformLocation | null;
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

type EulerAngles = {
  pitch: number
  roll: number
  yaw: number
}
