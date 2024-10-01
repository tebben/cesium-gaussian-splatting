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
  private scale: number;

  constructor(
    model: string,
    location: { lon: number; lat: number; height: number },
    rotation: { x: number; y: number; z: number },
    initialScale: number = 1
  ) {
    this.ready = false;
    this.model = model;
    this.location = location;
    this.rotation = rotation;
    this.scale = initialScale;

    window.addEventListener("keydown", (event) => {
      this.adjustScene(event);
    });
  }

  private adjustScene(event: KeyboardEvent) {
    switch (event.key) {
      case "q":
        this.scene.rotateY(0.005);
        break;
      case "w":
        this.scene.rotateY(-0.005);
        break;
      case "a":
        this.scene.rotateX(0.005);
        break;
      case "s":
        this.scene.rotateX(-0.005);
        break;
      case "z":
        this.scene.rotateZ(0.005);
        break;
      case "x":
        this.scene.rotateZ(-0.005);
        break;
      case "y":
        this.location.lat += 0.0000025;
        this.updatePosition();
        break;
      case "h":
        this.location.lat -= 0.0000025;
        this.updatePosition();
        break;
      case "j":
        this.location.lon += 0.0000025;
        this.updatePosition();
        break;
      case "g":
        this.location.lon -= 0.0000025;
        this.updatePosition();
        break;
      case "o": // Height increment
        this.location.height += 1;
        this.updatePosition();
        break;
      case "l": // Height decrement
        this.location.height -= 1;
        this.updatePosition();
        break;
      case "m":
        this.scale += 0.05;
        this.updateScale();
        break;
      case "n":
        if (this.scale > 0.05) {
          this.scale -= 0.05;
          this.updateScale();
        }
        break;
    }

    console.log(
      "Model:",
      this.model,
      "\nRotation:",
      this.scene.rotation.x,
      this.scene.rotation.y,
      this.scene.rotation.z,
      "\nLoc:",
      `Lon: ${this.location.lon}, Lat: ${this.location.lat}, Height: ${this.location.height}`,
      "\nScale:",
      this.scale
    );
  }

  private updatePosition() {
    const position = Cesium.Cartesian3.fromDegrees(
      this.location.lon,
      this.location.lat,
      this.location.height
    );
    this.scene.position.set(position.x, position.y, position.z);
  }

  private updateScale() {
    if (this.splatViewer.getSplatMesh()) {
      const mesh = this.splatViewer.getSplatMesh();
      mesh.scale.set(this.scale, this.scale, this.scale);
    }
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
        const mesh = this.splatViewer.getSplatMesh();
        mesh.scale.set(this.scale, this.scale, this.scale);
        this.scene.add(mesh);
        this.ready = true;
      });
  }
}
