import * as Cesium from "cesium";
import * as THREE from "three";

import { GaussianSplatLayer } from "./gaussian-splat-layer";

export class ThreeOoverlay {
  private cesiumViewer: Cesium.Viewer;
  private threeScene: THREE.Scene;
  private threeCamera: THREE.PerspectiveCamera;
  private threeRenderer: THREE.WebGLRenderer;
  private gausssianSplatLayers: GaussianSplatLayer[];

  constructor(cesiumViewer: Cesium.Viewer) {
    const threeContainer = document.getElementById("three");
    console.log(threeContainer);
    this.cesiumViewer = cesiumViewer;
    this.threeScene = new THREE.Scene();
    this.threeCamera = new THREE.PerspectiveCamera(
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
      this.threeCamera.aspect = width / height;
      this.threeCamera.updateProjectionMatrix();
    });
  }

  public addGaussianSplatLayer(model: string, location: { lon: number, lat: number, height: number }, rotation: { x: number, y: number, z: number }) {
    const layer = new GaussianSplatLayer(this.threeCamera, this.threeRenderer, model, location, rotation);
    this.threeScene.add(layer.threeScene);
    this.gausssianSplatLayers.push(layer);
  }

  public render() {
    this.threeCamera.fov = Cesium.Math.toDegrees(
      this.cesiumViewer.camera.frustum.fovy
    );
    this.threeCamera.updateProjectionMatrix();

    const cesiumCamera = this.cesiumViewer.camera;
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

    this.threeCamera.position.copy(cameraPositionVec3);
    this.threeCamera.up.copy(cameraUpVec3);
    this.threeCamera.lookAt(
      cameraPositionVec3.clone().add(cameraDirectionVec3)
    );

    this.gausssianSplatLayers.forEach((layer) => {
      if (!layer.ready) return;

      layer.splatViewer.update();
      layer.splatViewer.render();
    });

    this.threeRenderer.render(this.threeScene, this.threeCamera);
  }
}
