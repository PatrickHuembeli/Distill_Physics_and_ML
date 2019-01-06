// Load image from website
var svg = d3.select('body').append('svg').attr({
  width: 300,
  height: 300,
  border: '1px solid #ccc'
});

svg.append('svg:image')
.attr({
  'xlink:href': 'http://www.iconpng.com/png/beautiful_flat_color/computer.png',  // can also add svg file here
  x: 0,
  y: 0,
  width: 128,
  height: 128
});



// Show local image
// This only works with with python -m http.server
svg.append('svg:image')
.attr({
  'xlink:href': '/mnist_png/40.png',  // can also add svg file here
  x: 129,
  y: 0,
  width: 128,
  height: 128
});