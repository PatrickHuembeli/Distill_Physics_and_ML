// Defaults
var h_units = 2
var v_units = 2

var width = 700;
var height = 250;
// var hidden_units = 8
// var visible_units = 8
var radius = 20.0
var space = 70.0

ypos1 = 50
ypos2 = 200

// Add the space where it draws the RBM
var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height);

// This is an iterative method to add circles
h_data = [1,2,3]
svg.selectAll("hidden")
    .data(h_data)
    .enter().append("circle")
    .attr("cx", function (d) { return 50*d; })
    .attr("cy", 20) 
    .attr("r", radius)
    .attr('id', "hidden")
    .style("opacity", 0.5)
    .style("fill", "red")
    .style("stroke", "blue")
    .style("stroke-width", 2)

// with this method you only add one circle
var circle = svg.append("circle")
                         .attr("cx", 30)
                         .attr("cy", 30)
                         .attr("r", 20);
// with this method you only add one circle
svg.append("circle")
     .attr("cx", 30)
     .attr("cy", 60)
     .attr("r", 20);
     
// with this method you only add one line    
svg.append("svg:line")
    .attr("x1", 0)
    .attr("x2", 200)
    .attr("y1", 50)
    .attr("y2", 50)
    .style("stroke", "rgb(189, 189, 189)");

svg.append("svg:line")
    .attr("x1", 0)
    .attr("x2", 200)
    .attr("y1", 100)
    .attr("y2", 100)
    .style("stroke", "rgb(189, 189, 189)");
    
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
    
var slider = d3.slider() 
     .min(0) 
     .max(10) 
     .showRange(true) 
     .value(5) 
     .callback(function(evt) { 
     //fired every time the value changes 
     logger.debug('callback: ' + self.slider.value()); 
     }); 

d3.select('#myslider').call(slider); 
var currentVal = slider.value(); //manually get the current value 


d3.slider().on("slide", function(evt, value) {
  d3.select('#slider3text').text(value);
})