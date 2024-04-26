// src/types/three-helpers.d.ts
import * as THREE from 'three';

export declare module 'three' {
  class VertexNormalsHelper extends Object3D {
    constructor(object: Object3D, size?: number, hex?: number, linewidth?: number);
    update(): void;
  }

  class VertexTangentsHelper extends Object3D {
    constructor(object: Object3D, size?: number, hex?: number, linewidth?: number);
    update(): void;
  }
}