// import Scale from './SVG';

const url = 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/OGW/wms';

const WMS = {
  bbox: ([left, top, right, bottom]) => [left, top, right, bottom].join(','),
  parameters: ({ width, height, crs, bbox }) => {
    // const box = bbox.split(',').map(parseFloat);
    // const w = Math.floor(box[2] - box[0]) * Scale;
    // const h = Math.floor(box[3] - box[1]) * Scale;
    const params = Object.assign(WMS.defaults, {
      WIDTH: width,
      HEIGHT: height,
      CRS: crs,
      BBOX: bbox,
    });
    const keys = Object.keys(params);
    return keys.map(key => `${key}=${params[key]}`)
      .join('&');
  },
  getMap: (width, height, crs, bbox) => `${url}?${WMS.parameters({ width, height, crs, bbox })}`,
};

WMS.defaults = {
  SERVICE: 'WMS',
  REQUEST: 'GetMap',
  FORMAT: 'image/png',
  TRANSPARENT: 'TRUE',
  STYLES: '',
  VERSION: '1.3.0',
  LAYERS: 'OGWRGB13_15VL_vdc,OGWRGB13_15VL',
  WIDTH: 1920,
  HEIGHT: 729,
  CRS: 'EPSG:3857',
  BBOX: WMS.bbox([
    490217.5052396902,
    6675612.908620439,
    490790.782951829,
    6675830.575001766,
  ]),
};

export default WMS;
