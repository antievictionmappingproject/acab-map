$(function(){
    d3.select("#chart")
        .selectAll("div")
        .data([1,2,3,4])
    .enter().append("div")
        .style("height", function(d) { return d * 10 + "px"; })
        .text(function(d) { return d; });
});