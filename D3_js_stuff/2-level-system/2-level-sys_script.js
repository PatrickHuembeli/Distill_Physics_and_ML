var svg = d3.select("svg"),
    margin = {right: 50, left: 50}, // position of slider in color field
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height")
    centre = svg.attr("width")/2
    max_scale = 10 //max scale for x_e
    max_log_scale = 10000
    slider_y_pos = height / 8
    slider_e_y_pos = height / 8 + 100
    background_x_margin =  10
    background_height = 50
    energy_gap = 10.0
    y_line1 = 300 // y position of 2-level lines
    y_line2 = 500 
    xmargin = centre -350 // position of plot
    ymargin = y_line1
    width_plot = 200
    hight_plot = 200
    variable = 0
    plot_steps = 500

    
var x = d3.scaleLog()
    .base(10)
    .domain([0.1, max_log_scale])
    .range([0, width])
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
console.log(x.ticks(3))
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
        .on("start drag", function() { argh1 = x.invert(d3.event.x)
                                       handler1(argh1);
}));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(x.ticks(4))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; });

// Here we can change the style of the handle
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

slider.transition() // When html started it moves a bit
    .duration(500)
    .tween("hue", function() {
      var i = d3.interpolate(1000, 10);
      return function(t) { handler1(i(t)); };
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
        .on("start drag", function() {  argh2 = x_e.invert(d3.event.x)
                                        handler2(argh2); }));

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

// slider_e.transition() // When html started it moves a bit
//     .duration(500)
//     .tween("hue_e", function() {
//       var i = d3.interpolate(5, 0.1);
//       return function(t) { hue_e(i(t)); };
//     });
// -----------------------------------------------------------------------------
  
 
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
             
text1 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", y_line1)
            .text("occupation probability: "); 
            
text2 = svg.append("text")
            .attr("x", centre+100)
            .attr("y", y_line2)
            .text("occupation probability: ");            
                          
                          
text_test = svg.append("text")
            .attr("x", centre-30)
            .attr("y", y_line1 - 10)
            .text("occupation probability: ");                           


// -----------------------------------------------------------------------------
// PLOT functions

// set the ranges
var x_plot = d3.scaleLinear().domain([0,10]).range([width_plot, 0]);
var y_plot = d3.scaleLinear().range([hight_plot, 0]);


// define the line
var valueline = d3.line()
    .x(function(d) { return x_plot(d.x); })
    .y(function(d) { return y_plot(d.y); });


data = generateData(0.5, 0.5, plot_steps)
// Scale the range of the data
x_plot.domain(d3.extent(data, function(d) { return d.x; }));
y_plot.domain([0, d3.max(data, function(d) { return d.y; })]);

var vis = svg.append("svg:g")
    .attr("transform", "translate("+xmargin+","+ymargin+")") // gives position of svg

var g = vis.append("svg:g")
      .classed("series", true)

// Add the X Axis
g.append("g")
  .classed("grid x_grid", true)
  .attr("transform", "translate(0," + hight_plot + ")")
  .call(d3.axisBottom(x_plot).ticks(energy_gap).tickFormat(function (d) {
		return energy_gap*d/plot_steps;}));
        
g.append("g")
  .classed("grid x_grid", true)
  .attr("transform", "translate(0," + hight_plot - 100 + ")")
  .call(d3.axisTop(x_plot).tickSize(0,100,100)
        .tickFormat(""));        

// Add the Y Axis
g.append("g")
  .classed("grid x_grid", true)
  .attr("transform", "translate("+width_plot+"," + 0 + ")")
  .call(d3.axisLeft(y_plot).tickSize(0,100,100).tickFormat(""));

g.append("g")
  .classed("grid x_grid", true)
  .call(d3.axisLeft(y_plot).ticks(3).tickFormat(function (d) {
		return d;}));

circle3 = g.append("circle")
             .attr("cx", 10)
             .attr("cy", 10)
             .attr("r", 5); 

// Add the valueline path.
line = g.append("path")
  .attr("class", "lines")
  .attr("d", valueline(data));

// X-Axis Title  
g.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate("+ (width_plot/2) +","+(hight_plot + 40)+")")  
    .text("Energy Gap");  
// Y-Axis Title    
g.append("text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate("+ (0 - 40) +","+(hight_plot/2)+")rotate(-90)")  
    .text("Boltzmann Factor");      

// -----------------------------------------------------------------------------
// Initialize Sliders

var argh1 = 10
var argh2 = 5
handler2(5) // initialize energy at 5
handler1(10)
update(0.1)


// -----------------------------------------------------------------------------
// Fct of Slider 1
function handler1(h) {
  beta = 1/(h);
  zero_to_one = x(h)/width;
  handle.attr("cx", x(h));
  circle2.attr("opacity", 1 / (1 + Math.exp(energy_gap*beta)));
  text1.text("occupation probability: "  + (1 / (1 + Math.exp(energy_gap*beta))).toPrecision(3))
  circle1.attr("opacity", 1 / (1 + Math.exp(-energy_gap*beta)));
  text2.text("occupation probability: "+ (1 / (1 + Math.exp(-energy_gap*beta))).toPrecision(3))
  //svg.style("background-color", d3.hsl(h*10, 0.7, 0.9));
  //svg.style("background-color", d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4))
  rect.attr('fill', d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4));
  update(h)
}
// -----------------------------------------------------------------------------
// FCT of slider 2
function handler2(k) {
  energy_gap = 10*x_e(k)/width;
  handle_e.attr("cx", x_e(k));
  text_test.text("energy_gap: "+ energy_gap.toPrecision(3));
  handler1(argh1);
  y = y_line2 - (y_line2-y_line1)*x_e(k)/width
  line1.attr("y1", y);
  line1.attr("y2", y);
  circle2.attr("cy", y);
}
// -----------------------------------------------------------------------------
// Functions Plot

function generateData(temp, energy, samplelength) {
  var data = [];

  for (i = 0; i < samplelength; i++) {
    data.push({
      x: i,
      y: Math.exp(-i/(temp))
    });
  }

//   data.sort(function(a, b) {
//     return a.x - b.x;
//   })
  return data;
}

function pointposition(temp, energy, samplelength){
    max_energy = 10
    min_energy = 0
    diff = max_energy - min_energy
    pos_x = energy*width_plot/diff.toPrecision(1)
    console.log(pos_x)
    pos_y = Math.exp(-energy*(samplelength/max_energy)/(temp))
    // factor because we have to transform x-axis samplelength to energy
    console.log(energy)
    circle3.attr("cy", hight_plot-pos_y*hight_plot);
    circle3.attr("cx", width_plot - pos_x);
}


function update(temp) {
data1 = generateData(temp, 1.0, plot_steps)
// Add the valueline path.
line.datum(data1)
line.attr("d", valueline)
pointposition(temp, energy_gap, plot_steps)

}




