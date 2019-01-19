var svg = d3.select("svg"),
    margin = {right: 50, left: 50}, // position of slider in color field
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height")
    centre = svg.attr("width")/2
    max_scale = 10
    slider_y_pos = height / 8
    slider_e_y_pos = height / 8 + 100
    background_x_margin =  10
    background_height = 50
    energy_gap = 100.0;

var x = d3.scaleLinear() // x for temperature
    .domain([0, max_scale]) // x-axis values
    .range([0, width]) // width is the svg width minus the margins
    .clamp(true);
    
var x_e = d3.scaleLinear() // x for energy
    .domain([0, max_scale]) // x-axis values
    .range([0, width]) // width is the svg width minus the margins
    .clamp(true);    

rect= svg.append('rect')
               .attr('y', slider_y_pos - background_height/2)
               .attr('x', 0+background_x_margin)
               .attr('height', background_height)
               .attr('width', svg.attr("width")- 2*background_x_margin)
               .attr('fill', 'blue') 
               .attr('opacity', 0.5)
               
title = svg.append('text')
                .attr('y', slider_y_pos - background_height/2)
                .attr('x', centre)
                .text('Temperature')                

var slider = svg.append("g") // slider for temp
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + slider_y_pos + ")");
    // This defines slider position
         
var slider_e = svg.append("g") // slider for energy
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + slider_e_y_pos + ")");
    // This defines slider position         
         
// -----------------------------------------------------------------------------
// TEMP SLIDER
// -----------------------------------------------------------------------------
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
      var i = d3.interpolate(5, 0.1);
      return function(t) { hue(i(t)); };
    });
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// Energy SLIDER
// -----------------------------------------------------------------------------
slider_e.append("line")
    .attr("class", "track")
    .attr("x1", x_e.range()[0])
    .attr("x2", x_e.range()[1]) 
    // This defines from where to where the slider goes
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider_e.interrupt(); }) // this is the function that makes the slider movable
        .on("start drag", function() { hue_e(x_e.invert(d3.event.x)); }));

slider_e.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(x_e.ticks(10))
  .enter().append("text")
    .attr("x", x_e)
    .attr("text-anchor", "middle")
    .text(function(d) { return d + "E"; });

// Here we can change the style of the handle
var handle_e = slider_e.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider_e.transition() // When html started it moves a bit
    .duration(500)
    .tween("hue_e", function() {
      var i = d3.interpolate(5, 0.1);
      return function(t) { hue_e(i(t)); };
    });
// -----------------------------------------------------------------------------


var y_line1 = 300
    y_line2 = 350    
 
line1 = svg.append("svg:line")
    .attr("x1", centre - 75)
    .attr("x2", centre + 75)
    .attr("y1", y_line1)
    .attr("y2", y_line1)
    .style("stroke", "black");

line2 = svg.append("svg:line")
    .attr("x1", centre - 75)
    .attr("x2", centre + 75)
    .attr("y1", y_line2)
    .attr("y2", y_line2)
    .style("stroke", "black");


circle1 = svg.append("circle")
             .attr("cx", centre)
             .attr("cy", y_line2)
             .attr("r", 20);


circle2 = svg.append("circle")
             .attr("cx", centre)
             .attr("cy", y_line1)
             .attr("r", 20);
             
text2 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", y_line1)
            .text("occupation probability: "); 
            
text1 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", y_line2)
            .text("occupation probability: ");            
                          
                          
text_test = svg.append("text")
            .attr("x", centre+100)
            .attr("y", y_line2+200)
            .text("occupation probability: ");                           

hue_e(1) // initialize energy at 5
var arg_hue = 1.0



function hue(h) {
  arg_hue = h;
  console.log(x(h))
  beta = 1/(x(h)/width*max_scale);
  zero_to_one = x(h)/width;
  handle.attr("cx", x(h));
  circle2.attr("opacity", 1 / (1 + Math.exp(energy_gap*beta)));
  text2.text("occupation probability: "  + (1 / (1 + Math.exp(energy_gap*beta))).toPrecision(3))
  circle1.attr("opacity", 1 / (1 + Math.exp(-energy_gap*beta)));
  text1.text("occupation probability: "+ (1 / (1 + Math.exp(-energy_gap*beta))).toPrecision(3))
  //svg.style("background-color", d3.hsl(h*10, 0.7, 0.9));
  //svg.style("background-color", d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4))
  rect.attr('fill', d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4));
}

function hue_e(i) {
  energy_gap = 10*x_e(i)/width;
  handle_e.attr("cx", x_e(i));
  text_test.text("energy_gap: "+ energy_gap);
  hue(arg_hue);
  y = y_line1 + (y_line2-y_line1)*x_e(i)/width*2
  line2.attr("y1", y);
  line2.attr("y2", y);
  circle1.attr("cy", y);
}








