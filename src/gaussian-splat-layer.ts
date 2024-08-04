import * as Cesium from "cesium";
import * as THREE from "three";
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export class GaussianSplatLayer {
    public threeScene!: THREE.Scene;
    public splatViewer: GaussianSplats3D.DropInViewer;
    public ready: boolean;

    private camera: THREE.Camera;
    private renderer: THREE.Renderer;
    private model: string;
    private location: { lon: number, lat: number, height: number };
    private rotation: { x: number, y: number, z: number };

	constructor(camera: THREE.Camera, renderer: THREE.Renderer, model: string, location: { lon: number, lat: number, height: number }, rotation: { x: number, y: number, z: number }) {
        this.ready = false;
        this.camera = camera;
        this.renderer = renderer;
        this.model = model;
        this.location = location;
        this.rotation = rotation;
		this.createScene();

        // for rotation debugging
        window.addEventListener('keydown', (event) => {
            this.rotateScene(event);
        });
	}

    private rotateScene(event: KeyboardEvent) {
        if (event.key === 'q') {
            this.threeScene.rotateY(0.05);
        } else if (event.key === 'w') {
            this.threeScene.rotateY(-0.05);
        } else if (event.key === 'a') {
            this.threeScene.rotateX(0.05);
        }else if (event.key === 's') {
            this.threeScene.rotateX(-0.05);
        }else if (event.key === 'z') {
            this.threeScene.rotateZ(0.05);
        }else if (event.key === 'x') {
            this.threeScene.rotateZ(-0.05);
        }

        console.log(this.threeScene.rotation.x, this.threeScene.rotation.y, this.threeScene.rotation.z);
    }

	private createScene() {
        const position = Cesium.Cartesian3.fromDegrees(this.location.lon, this.location.lat, this.location.height);

        this.splatViewer = new GaussianSplats3D.Viewer({
            selfDrivenMode: false,
            gpuAcceleratedSort: true,
            sharedMemoryForWorkers: false,
            ignoreDevicePixelRatio: true,
            sceneRevealMode: GaussianSplats3D.SceneRevealMode.Always,
            useBuiltInControls: false,
            camera: this.camera,
            renderer: this.renderer,
        });

        // create parent scene and place at position
        // placing the gaussian directly results in jittering and 
        // wrong place gaussians
        this.threeScene = new THREE.Scene();
        this.threeScene.position.set(position.x, position.y, position.z);
        this.threeScene.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    
        this.splatViewer
            .addSplatScene(this.model, {
                showLoadingUI: false,
                progressiveLoad: false,
                rotation: [0,0,0],
                scale: [1,1,1],
            })
            .then(() => {
                this.threeScene.add(this.splatViewer.getSplatMesh());
                this.ready = true;
            });
	}
}
