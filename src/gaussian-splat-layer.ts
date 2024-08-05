import * as Cesium from "cesium";
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export class GaussianSplatLayer {
  public scene!: THREE.Scene;
  public splatViewer: GaussianSplats3D.Viewer;
  public ready: boolean;

  private model: string;
  private location: { lon: number; lat: number; height: number };
  private rotation: { x: number; y: number; z: number };

  constructor(
    model: string,
    location: { lon: number; lat: number; height: number },
    rotation: { x: number; y: number; z: number }
  ) {
    this.ready = false;
    this.model = model;
    this.location = location;
    this.rotation = rotation;

    // A b*tch to get the rotation correctly
    // so adding some keys to debug and find the rotation
    window.addEventListener("keydown", (event) => {
      this.rotateScene(event);
    });
  }

  private rotateScene(event: KeyboardEvent) {
    if (event.key === "q") {
      this.scene.rotateY(0.05);
    } else if (event.key === "w") {
      this.scene.rotateY(-0.05);
    } else if (event.key === "a") {
      this.scene.rotateX(0.05);
    } else if (event.key === "s") {
      this.scene.rotateX(-0.05);
    } else if (event.key === "z") {
      this.scene.rotateZ(0.05);
    } else if (event.key === "x") {
      this.scene.rotateZ(-0.05);
    }

    console.log(
      "roation",
      this.model,
      this.scene.rotation.x,
      this.scene.rotation.y,
      this.scene.rotation.z
    );
  }

  public setup(camera: THREE.Camera, renderer: THREE.Renderer) {
    const position = Cesium.Cartesian3.fromDegrees(
      this.location.lon,
      this.location.lat,
      this.location.height
    );

    this.splatViewer = new GaussianSplats3D.Viewer({
      selfDrivenMode: false,
      gpuAcceleratedSort: true,
      sharedMemoryForWorkers: false,
      ignoreDevicePixelRatio: true,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Always,
      useBuiltInControls: false,
      camera: camera,
      renderer: renderer,
    });

    // create parent scene and place at given position
    // placing the splat scene directly at a world location
    // results in jittering and inconsistent gaussian positions
    // due to too large numbers
    this.scene = new THREE.Scene();
    this.scene.position.set(position.x, position.y, position.z);
    this.scene.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this.splatViewer
      .addSplatScene(this.model, {
        showLoadingUI: false,
        progressiveLoad: false,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      })
      .then(() => {
        this.scene.add(this.splatViewer.getSplatMesh());
        this.ready = true;
      });
  }
}
