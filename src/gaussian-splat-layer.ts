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

	constructor(camera: THREE.Camera, renderer: THREE.Renderer, model: string) {
        this.ready = false;
        this.camera = camera;
        this.renderer = renderer;
        this.model = model;
		this.createScene();
	}

	private createScene() {
        const position = Cesium.Cartesian3.fromDegrees(5.31911, 51.687273, 52.1);

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
    
        this.splatViewer
            .addSplatScene(this.model, {
                showLoadingUI: false,
                progressiveLoad: false,
                rotation: this.eulerToQuaternion(-78,100,10),
                scale: [1,1,1],
            })
            .then(() => {
                this.threeScene.add(this.splatViewer.getSplatMesh());
                this.ready = true;
            });
	}

    private eulerToQuaternion(xDeg: number, yDeg: number, zDeg: number): number[] {
        // Convert angles from degrees to radians
        const xRad = xDeg * (Math.PI / 180);
        const yRad = yDeg * (Math.PI / 180);
        const zRad = zDeg * (Math.PI / 180);
    
        // Compute quaternion for X-axis rotation
        const cx = Math.cos(xRad / 2);
        const sx = Math.sin(xRad / 2);
    
        // Compute quaternion for Y-axis rotation
        const cy = Math.cos(yRad / 2);
        const sy = Math.sin(yRad / 2);
    
        // Compute quaternion for Z-axis rotation
        const cz = Math.cos(zRad / 2);
        const sz = Math.sin(zRad / 2);
    
        // The combined quaternion components:
        const w = cx * cy * cz + sx * sy * sz;
        const x = sx * cy * cz - cx * sy * sz;
        const y = cx * sy * cz + sx * cy * sz;
        const z = cx * cy * sz - sx * sy * cz;
    
        return [x, y, z, w];
    }
}
