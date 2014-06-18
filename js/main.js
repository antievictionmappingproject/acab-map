var map,
    layer,
    layer_data,
    scale = d3.scale.linear();

scale.domain([1,100]).rangeRound([1,10]);

function addOverlay() {

  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g   = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("/acabmap/bayarea-neighborhoods.geo.json", function(collection) {
      var bounds = d3.geo.bounds(collection),
          path = d3.geo.path().projection(project);

      var feature = g.selectAll("path")
          .data(collection.features)
        .enter()
          .append("path")
          .attr("stroke-width","2px")
          .attr("stroke","green")
          .attr("fill","transparent")
          .on('mouseover',function(d){
            console.log(d.properties.NAME)
          });

      map.on("viewreset", reset);
      reset();

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

      // Use Leaflet to implement a D3 geographic projection.
      function project(x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
        return [point.x, point.y];
      }

    });
  return svg;
}

(function($){
    map = L.map('map',{maxZoom: 19});
    layer = new L.StamenTileLayer("toner-lite");
    map.addLayer(layer).setView(new L.LatLng(37.7833, -122.4167), 12);
    addOverlay();
})($);

