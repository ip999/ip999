var mapimg;
var iss;
var clat = 0;
var clon = 0;
var ww = 1024;
var hh = 512;
var dia = 3;
var iss_lat = 0;
var iss_lon = 0;
var zoom = 1;
var interval = setInterval(iss_update, 5000);

function preload() {
  // The clon and clat in this url are edited to be in the correct order.
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon + ',' + clat + ',' + zoom + '/' + ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiaXA5IiwiYSI6ImNqZGZ5aHJkZzBhaXAyeHBpdHF0NjVnczMifQ.wtEhgCIiP_ttvOqCYHb6ng');

    loadJSON("http://api.open-notify.org/iss-now.json", gotISSData, 'jsonp');
  }

function iss_update() {
  console.log("Updating...");
  loadJSON("http://api.open-notify.org/iss-now.json", gotISSData, 'jsonp');
}

function gotISSData(data) {
    if (data.message == "success") {
      iss_lat = data.iss_position.latitude;
      iss_lon = data.iss_position.longitude;
    }
}

function mercX(lon) {
    lon = radians(lon);
    var a = (256 / PI) * pow(2, zoom);
    var b = lon + PI;
    return a * b;
}

function mercY(lat) {
    lat = radians(lat);
    var a = (256 / PI) * pow(2, zoom);
    var b = tan(PI / 4 + lat / 2);
    var c = PI - log(b);
    return a * c;
}

function setup() {
  createCanvas(ww, hh);
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);
}

function draw() {
  frameRate(0.2);
  draw_iss();
}

function draw_iss() {
  translate(width / 2, height / 2);
  var cx = mercX(clon);
  var cy = mercY(clat);
  var x = mercX(iss_lon) - cx;
  var y = mercY(iss_lat) - cy;
  if(x < - width/2) {
    x += width;
  } else if(x > width / 2) {
    x -= width;
  }
  stroke(255, 0, 255);
  fill(255, 0, 255, 150);
  ellipse(x, y, dia, dia);
  console.log("Drawing: " + x + " "+ y);
}
