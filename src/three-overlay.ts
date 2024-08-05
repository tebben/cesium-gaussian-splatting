import * as Cesium from "cesium";
import * as THREE from "three";

import { GaussianSplatLayer } from "./gaussian-splat-layer";

export class ThreeOverlay {
  private cesiumCamera: Cesium.Camera;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private threeRenderer: THREE.WebGLRenderer;
  private gausssianSplatLayers: GaussianSplatLayer[];

  constructor(cesiumCamera: Cesium.Camera) {
    const threeContainer = document.getElementById("three");
    this.cesiumCamera = cesiumCamera;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000000
    );
    this.threeRenderer = new THREE.WebGLRenderer({ alpha: true });
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    this.gausssianSplatLayers = [];
    threeContainer?.appendChild(this.threeRenderer.domElement);
    this.sizeChange();
  }

  private sizeChange() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.threeRenderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });
  }

  public addGaussianSplatLayer(layer: GaussianSplatLayer) {
    layer.setup(this.camera, this.threeRenderer);
    this.scene.add(layer.scene);
    this.gausssianSplatLayers.push(layer);
  }

  // Sync camera code taken from https://github.com/leon-juenemann/cesiumjs-with-threejs
  public render() {
    this.camera.fov = Cesium.Math.toDegrees(this.cesiumCamera.frustum.fovy);
    this.camera.updateProjectionMatrix();

    const cesiumCamera = this.cesiumCamera;
    const cvm = cesiumCamera.viewMatrix;
    const civm = cesiumCamera.inverseViewMatrix;
    const cameraPosition = Cesium.Cartesian3.fromElements(
      civm[12],
      civm[13],
      civm[14]
    );
    const cameraDirection = new Cesium.Cartesian3(-cvm[2], -cvm[6], -cvm[10]);
    const cameraUp = new Cesium.Cartesian3(cvm[1], cvm[5], cvm[9]);

    const cameraPositionVec3 = new THREE.Vector3(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );
    const cameraDirectionVec3 = new THREE.Vector3(
      cameraDirection.x,
      cameraDirection.y,
      cameraDirection.z
    );
    const cameraUpVec3 = new THREE.Vector3(cameraUp.x, cameraUp.y, cameraUp.z);

    this.camera.position.copy(cameraPositionVec3);
    this.camera.up.copy(cameraUpVec3);
    this.camera.lookAt(cameraPositionVec3.clone().add(cameraDirectionVec3));

    this.gausssianSplatLayers.forEach((layer) => {
      if (!layer.ready) return;

      layer.splatViewer.update();
      layer.splatViewer.render();
    });

    this.threeRenderer.render(this.scene, this.camera);
  }
}
