var svg = d3.select("svg"),
    margin = {right: 50, left: 50}, // position of slider in color field
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height")
    centre = svg.attr("width")/2
    max_scale = 10;

var x = d3.scaleLinear()
    .domain([0, max_scale]) // x-axis values
    .range([0, width]) // width is the svg width minus the margins
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height / 8 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1]) 
    // This defines from where to where the slider goes
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); }) // this is the function that makes the slider movable
        .on("start drag", function() { hue(x.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "K"; });

// Here we can change the style of the handle
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // When html started it moves a bit
    .duration(500)
    .tween("hue", function() {
      var i = d3.interpolate(5, 0);
      return function(t) { hue(i(t)); };
    });
 
svg.append("svg:line")
    .attr("x1", centre - 75)
    .attr("x2", centre + 75)
    .attr("y1", 250)
    .attr("y2", 250)
    .style("stroke", "black");

svg.append("svg:line")
    .attr("x1", centre - 75)
    .attr("x2", centre + 75)
    .attr("y1", 300)
    .attr("y2", 300)
    .style("stroke", "black");


circle1 = svg.append("circle")
             .attr("cx", centre)
             .attr("cy", 300)
             .attr("r", 20);


circle2 = svg.append("circle")
             .attr("cx", centre)
             .attr("cy", 250)
             .attr("r", 20);
             
text2 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", 250)
            .text("occupation probability: "); 
            
text1 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", 300)
            .text("occupation probability: ");  
                          


function hue(h) {
  beta = 1/(x(h)/width*max_scale);
  zero_to_one = x(h)/width;
  handle.attr("cx", x(h));
  circle2.attr("opacity", 1 / (1 + Math.exp(beta)));
  text2.text("occupation probability: "  + (1 / (1 + Math.exp(beta))).toPrecision(3))
  circle1.attr("opacity", 1 / (1 + Math.exp(-beta)));
  text1.text("occupation probability: "+ (1 / (1 + Math.exp(-beta))).toPrecision(3))
  //svg.style("background-color", d3.hsl(h*10, 0.7, 0.9));
  svg.style("background-color", d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4));
}









