import { Viewer } from "./viewer";

const viewer = new Viewer();

if (viewer.cesium) {
  const location = {
    lon: 5.31911,
    lat: 51.685,
    height: 200,
  };

  viewer.flyTo(location.lon, location.lat, location.height, 0, -45, 0);
}

//viewer.addGaussianSplatLayer("./data/tuin.splat");
