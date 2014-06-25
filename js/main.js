var map,
    layer,
    layer_data,
    RdYlGn = {
3: ["#fc8d59","#ffffbf","#91cf60"],
4: ["#d7191c","#fdae61","#a6d96a","#1a9641"],
5: ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],
6: ["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],
7: ["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],
8: ["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
9: ["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],
10: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],
11: ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]},
    scale = d3.scale.linear().range(RdYlGn[3].reverse())

function addOverlay() {

  var bounds,
      path,
      feature,
      year = 2003,
      svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g   = svg.append("g").attr("class", "leaflet-zoom-hide");
  
  function get_data() {
    queue()
      .defer(d3.json, "/acabmap/bayarea-zips.geo.json")
      .defer(d3.json, "/acabmap/sfpd/sfpd_compiled_incidents_"+year+".json")
      .await(init);
    year += 1;
    if (year == 2015) {
      year = 2003
    }
  }
  
  function init(error, collection, data) {
    //Get values to calculate min/max
    var totals = _.values(data[4]);
    scale.domain( [_.min(totals), _.median(totals), _.max(totals)] );
    bounds = d3.geo.bounds(collection);
    path = d3.geo.path().projection(project);

    feature = g.selectAll("path")
        .data(collection.geometries);
      
    feature.enter()
      .append("path")
      .attr("stroke-width","2px")
      .attr("stroke","green");
    
    map.on("viewreset", reset);
    reset();

    var month = 0
    var inner_interval = window.setInterval(function(){
      feature
        .attr("fill",function(d){return scale(data[month][d.zip])})
        .attr("fill-opacity",.7)
        .on('mouseover',function(d){
          console.log(data[month][d.zip]);
        });
      month += 1;
      if(month == 12) {
        clearInterval(inner_interval);
        get_data();
      }
    }, 3000);
  }

  // Reposition the SVG to cover the features.
  function reset() {
    var bottomLeft = project(bounds[0]),
        topRight = project(bounds[1]);

    svg.attr("width", topRight[0] - bottomLeft[0])
      .attr("height", bottomLeft[1] - topRight[1])
      .style("margin-left", bottomLeft[0] + "px")
      .style("margin-top", topRight[1] + "px");

    g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

    feature.attr("d", path);
  }

  function layerData() {

  }

  // Use Leaflet to implement a D3 geographic projection.
  function project(x) {
    var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
    return [point.x, point.y];
  }

  get_data();
  return svg;
}

(function($){
    map = L.map('map',{maxZoom: 19});
    layer = new L.StamenTileLayer("toner-lite");
    map.addLayer(layer).setView(new L.LatLng(37.7833, -122.4167), 12);
    addOverlay();
})($);

