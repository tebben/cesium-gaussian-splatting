import { Viewer } from "./viewer";

const viewer = new Viewer();

function loadGarden() {
  viewer.flyTo(5.31905, 51.68717, 60, 10, -45, 0);
  viewer.addGaussianSplatLayer("./data/tuin.splat", { lon: 5.31911, lat: 51.687273, height: 52.1 }, { x: -78, y: 100, z: 10 });
}

function loadArcheryClub() {
  viewer.flyTo(5.30796, 51.70628, 68.71447, 92.46323, -42.91710, 0);
  viewer.addGaussianSplatLayer("./data/target.splat", { lon: 5.308332, lat: 51.706254, height: 50.3 }, 
    { x: 1.199285294426387, y: -0.561475491622485, z: 2.430876453678189 });
}

if (viewer.cesium) {
  loadArcheryClub();
}