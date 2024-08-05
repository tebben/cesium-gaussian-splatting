import { GaussianSplatLayer } from "./gaussian-splat-layer";
import { Viewer } from "./viewer";

const viewer = new Viewer();


function loadArcheryClub() {
  viewer.flyTo(5.30731, 51.70644, 65.24274, 127.00461, -17.11404, 0);

  //viewer.flyTo(5.30796, 51.70628, 68.71447, 92.46323, -42.91710, 0);
    const targetLayer = new GaussianSplatLayer(
      "./data/target.splat",
      { lon: 5.308332, lat: 51.706254, height: 50.3 },
      { x: 1.199285294426387, y: -0.561475491622485, z: 2.430876453678189 }
    );

      //viewer.flyTo(5.30742, 51.70615, 68.66736, 92.46323, -42.91710, 0);
    const buildingLayer = new GaussianSplatLayer(
      "./data/pb.splat",
      { lon: 5.30762, lat: 51.70612, height: 50.3 },
      { x: 1.9586619087229662, y: 0.4766092669791268, z: 2.3042657339892942 }
    )

    viewer.addGaussianSplatLayer(targetLayer);
    viewer.addGaussianSplatLayer(buildingLayer);
}

if (viewer.cesium) {
  loadArcheryClub();
}  
