const identity_twolevel = "#twolevel_sys_id"

var margin = {right: 50, left: 50}, // position of slider in color field
    width = 700
    height = 600

var svg2 = d3.select(identity_twolevel)
    .append("svg")
    .attr('class','figures')
    .attr("width", width)
    .attr("height", height);

var centre = width/2
    max_scale = 10 //max scale for x_e
    max_log_scale = 10000
    slider_y_pos = height / 8
    slider_e_y_pos = height / 8 + 100
    background_margin =  {right: 20, left: 20}
    background_height = 50
    energy_gap = 10.0
    y_line1 = 300 // y position of 2-level lines
    y_line2 = 500 
    xplot = centre -250 // position of plot
    yplot = y_line1
    width_plot = 200 // Size plot
    hight_plot = 200
    x_2level = 500 // 2level sys position
    x_text_energy = centre // Text positions
    y_text_energy = slider_e_y_pos - 20
    x_text_temp = centre
    y_text_temp = slider_y_pos - background_height/2 
    x_text_prob = 600
    variable = 0
    plot_steps = 500

    
var x_temp = d3.scaleLog()
    .base(10)
    .domain([0.1, max_log_scale])
    .range([0, width - 2*margin.right])
    .clamp(true);    
      
var x_e = d3.scaleLinear() // x for energy
    .domain([0, max_scale]) // x-axis values
    .range([0, width- 2*margin.right]) // width is the svg width minus the margins
    .clamp(true);    
                               
rect= svg2.append('rect')
               .attr('y', slider_y_pos - background_height/2)
               .attr('x', background_margin.left)
               .attr('height', background_height)
               .attr('width', width- 2*background_margin.right)
               .attr('fill', 'blue') 
               .attr('opacity', 0.5)
               

var slider = svg2.append("g") // slider for temp
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + slider_y_pos + ")");
    // This defines slider position
         
var slider_e = svg2.append("g") // slider for energy
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + slider_e_y_pos + ")");
    // This defines slider position         


// -----------------------------------------------------------------------------
// // TEMP SLIDER
// // -----------------------------------------------------------------------------
console.log(x_temp.ticks(3))
slider.append("line")
    .attr("class", "track")
    .attr("x1", x_temp.range()[0])
    .attr("x2", x_temp.range()[1]) 

    // This defines from where to where the slider goes
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); }) // this is the function that makes the slider movable
        .on("start drag", function() { argh1 = x_temp.invert(d3.event.x)
                                       handler1(argh1);
}));

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(x_temp.ticks(4))
  .enter().append("text")
    .attr("x", x_temp)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; });

// Here we can change the style of the handle
var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

// slider.transition() // When html started it moves a bit
//     .duration(500)
//     .tween("hue", function() {
//       var i = d3.interpolate(1000, 10);
//       return function(t) { handler1(i(t)); };
//     });

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
  
 
line1 = svg2.append("line")
    .attr("x1", x_2level - 75)
    .attr("x2", x_2level + 75)
    .attr("y1", y_line1)
    .attr("y2", y_line1)
    .style("stroke", "black");

line2 = svg2.append("line")
    .attr("x1", x_2level - 75)
    .attr("x2", x_2level + 75)
    .attr("y1", y_line2)
    .attr("y2", y_line2)
    .style("stroke", "black");


circle1 = svg2.append("circle")
             .attr("cx", x_2level)
             .attr("cy", y_line2)
             .attr("r", 20);
             
circle2 = svg2.append("circle")
             .attr("cx", x_2level)
             .attr("cy", y_line1)
             .attr("r", 20);                         
             
text1 = svg2.append("text")
            .attr("class", "general_text")
            .attr("x", x_text_prob)
            .attr("y", y_line1)
            .text("p₀: "); 
            
text2 = svg2.append("text")
            .attr("class", "general_text")
            .attr("x", x_text_prob)
            .attr("y", y_line2)
            .text("p₁: ");            
                          
                          
text_egap = svg2.append("text")
            .attr("class", "general_text")
            .attr("x", x_text_energy)
            .attr("y", y_text_energy)
            .text("Energy Gap: "); 
            
text_temp = svg2.append('text')
                .attr("class", "general_text")
                .attr('y', slider_y_pos - background_height/2)
                .attr('x', centre)
                .text('Temperature')                                       


// -----------------------------------------------------------------------------
// PLOT functions

// set the ranges
var x_plot = d3.scaleLinear().range([width_plot, 0]);
var y_plot = d3.scaleLinear().range([hight_plot, 0]);


// define the line
var valueline = d3.line()
    .x(function(d) { return x_plot(d.x); })
    .y(function(d) { return y_plot(d.y); });


data = generateData(0.5, 0.5, plot_steps)
// Scale the range of the data
x_plot.domain(d3.extent(data, function(d) { return d.x; }));
y_plot.domain([0, d3.max(data, function(d) { return d.y; })]);

var g = svg2.append("g")
    .attr("transform", "translate("+xplot+","+yplot+")") // gives position of svg

// var g = vis.append("g")
//       .classed("series", true)

// Add the X Axis
g.append("g")
  .classed("grid x_grid", true)
  .attr("class", "plot-ticks")
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
    .attr("class", "plot-ticks")
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
    .attr("class", "axis-text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate("+ (width_plot/2) +","+(hight_plot + 40)+")")  
    .text("Energy Gap");  
// Y-Axis Title    
g.append("text")
    .attr("class", "axis-text")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate("+ (0 - 40) +","+(hight_plot/2)+")rotate(-90)")  
    .text("Boltzmann Factor");      

g.append("text")
    .attr("class", "plot-title")
    .attr("text-anchor", "middle") 
    .attr("transform", "translate("+ 70  +","+(0-10)+")")  
    .text("Unnormalized probability amplitude of excited state");   
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
  zero_to_one = x_temp(h)/width;
  handle.attr("cx", x_temp(h));
  circle2.attr("opacity", 1 / (1 + Math.exp(energy_gap*beta)));
  text1.text(" p₁: "  + (1 / (1 + Math.exp(energy_gap*beta))).toPrecision(3))
  circle1.attr("opacity", 1 / (1 + Math.exp(-energy_gap*beta)));
  text2.text("p₀: "+ (1 / (1 + Math.exp(-energy_gap*beta))).toPrecision(3))
    text_temp.text("Temperature: "+ argh1.toPrecision(4));
  //svg.style("background-color", d3.hsl(h*10, 0.7, 0.9));
  //svg.style("background-color", d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4))
  rect.attr('fill', d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4));
  update(h)
  console.log(h)
}
// -----------------------------------------------------------------------------
// FCT of slider 2
function handler2(k) {
  energy_gap = 10*x_e(k)/(width-margin.left-margin.right);
  handle_e.attr("cx", x_e(k));
  text_egap.text("Energy Gap: "+ energy_gap.toPrecision(3));
  handler1(argh1);
  y = y_line2 - (y_line2-y_line1)*x_e(k)/(width-margin.left-margin.right)
  line1.attr("y1", y);
  line1.attr("y2", y);
  text1.attr("y",y)
  circle2.attr("cy", y);
}
// -----------------------------------------------------------------------------
// Functions Plot

function generateData(temp, energy_gap, samplelength) {
  var data = [];

  for (i = 0; i < samplelength; i++) {
    data.push({
      x: i,
      y: Math.exp(-(i*energy_gap/samplelength)/(temp))
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
    pos_y = Math.exp(-energy/(temp))
    // factor because we have to transform x-axis samplelength to energy
    console.log(energy.toPrecision(2))
    circle3.attr("cy", hight_plot-pos_y*hight_plot);
    circle3.attr("cx", width_plot - pos_x);
}


function update(temp) {
data1 = generateData(temp, 10, plot_steps)
// Add the valueline path.
line.datum(data1)
line.attr("d", valueline)
pointposition(temp, energy_gap, plot_steps)

}




