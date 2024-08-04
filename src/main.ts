import { Viewer } from "./viewer";

const viewer = new Viewer();

if (viewer.cesium) {
  const location = {
    lon: 5.31905,
    lat: 51.68717,
    height: 60  };

  viewer.flyTo(location.lon, location.lat, location.height, 10, -45, 0);
}

viewer.addGaussianSplatLayer("./data/tuin.splat");
