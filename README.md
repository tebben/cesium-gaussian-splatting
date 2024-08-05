# cesium-gaussian-splatting

Test to see if we can get gaussian splatting to work in CesiumJS using the Three.js based Gaussian splatting viewer from [@mkkellogg/gaussian-splats-3d](https://github.com/mkkellogg/GaussianSplats3D)

> [Demo on Github Pages](https://tebben.github.io/cesium-gaussian-splatting/)

![Alt text](./img/screenshot_1.webp?raw=true "Gaussian Splatting in CesiumJS")

## Run

```sh
npm install
npm run dev
```

## Info

The demo uses 2 simple .splat files shot with a phone using [Scaniverse](https://scaniverse.com/) which are cleaned up up a bit using [supersplat](https://github.com/playcanvas/supersplat) These are far from high quality splats but this doesn't matter for our test.

To be able to show Three.js scenes within CesiumJS we need to render the Three stuff on top of Cesium and sync the Cesium camera to Three, this is not ideal because things are not aware of eachother and Three scenes can be seen trough the terrain and other objects placed in CesiumJS such as buildings.
