const identity_test = "#test_figure_id"

// myFunction reads from slider and updates everything
// Fct of Slider 1
function temp_slider(val) {
  slider_text = document.getElementById("temperature_slider")
  slider_text.innerHTML = val //this updates <p> where values is written
//   slider_text.style.backgroundColor = "yellow";
  slider_element = document.getElementById("temp_slider_id")
//   slider_element.style.backgroundColor = "yellow"
  energy = document.getElementById("energy_slider").innerHTML
  beta = 1/(x_temp(val));
  energy_gap = x_e(energy);
    zero_to_one = x_temp(val)
  circle2.attr("opacity", 1 / (1 + Math.exp(energy_gap*beta)));
  text1.text(" p₁: "  + (1 / (1 + Math.exp(energy_gap*beta))).toPrecision(3))
  circle1.attr("opacity", 1 / (1 + Math.exp(-energy_gap*beta)));
  text2.text("p₀: "+ (1 / (1 + Math.exp(-energy_gap*beta))).toPrecision(3))
//     text_temp.text(function(){return "Temperature: "+ x_temp(val).toPrecision(4)});
//   rect.attr('fill', d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4));
  slider_text.style.backgroundColor = d3.rgb(zero_to_one*255, 0.0, (1-zero_to_one)*255 ,0.4)
  update(x_temp(val)); 
}

function energy_slider(val) {
  tempp = document.getElementById("temperature_slider").innerHTML
  document.getElementById("energy_slider").innerHTML = val
  energy_gap = x_e(val);
//   text_egap.text("Energy Gap: "+ energy_gap.toPrecision(3));
  temp_slider(tempp);
  y = y_line2 - (y_line2-y_line1)*x_e(val)/10
  line1.attr("y1", y);
  line1.attr("y2", y);
  text1.attr("y",y)
  circle2.attr("cy", y);
}

var margin = {right: 0, left: 0}, // position of slider in color field
    width = 700
    height = 600

var svg2 = d3.select(identity_test)
    .append("svg")
    .attr('class','figures')
    .attr("width", "150%")
    .attr("height", 350);

var centre = width/2
    max_scale = 10 //max scale for x_e
    max_log_scale = 10000
    energy_gap = 10.0
    y_line1 = 50 // y position of 2-level lines
    y_line2 = 250 
    xplot = 50 // position of plot
    yplot = y_line1
    width_plot = 200 // Size plot
    hight_plot = 200
    x_2level = 310 // 2level sys position
    x_text_prob = 600
    variable = 0
    plot_steps = 500

    
var x_temp = d3.scalePow()
    .exponent(5)
    .domain([0.001, 1])
    .range([0.1, 10000])
    .clamp(true);    
      
var x_e = d3.scaleLinear() // x for energy
    .domain([0, max_scale]) // x-axis values
    .range([0, 10]) // width is the svg width minus the margins
    .clamp(true);    
                               
line1 = svg2.append("line")
    .attr("x1", x_2level - 50)
    .attr("x2", x_2level + 50)
    .attr("y1", y_line1)
    .attr("y2", y_line1)
    .style("stroke", "black");

line2 = svg2.append("line")
    .attr("x1", x_2level - 50)
    .attr("x2", x_2level + 50)
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
                                                 
// -----------------------------------------------------------------------------
// PLOT functions

// set the ranges
var x_plot = d3.scaleLinear().range([ 0, width_plot]);
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
    .attr("transform", "translate("+xplot+","+50+")") // gives position of svg

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
//   .attr("transform", "translate(0," + hight_plot  + ")")
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
energy_line = g.append("path")
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
    .text("Relative likelihood");      

  
// -----------------------------------------------------------------------------
// Initialize Sliders

var argh1 = 10
var argh2 = 5
// handler2(5) // initialize energy at 5
// handler1(10)
update(0.1)

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
    circle3.attr("cy", hight_plot-pos_y*hight_plot);
    circle3.attr("cx", pos_x);
}


function update(temp) {
data1 = generateData(temp, 10, plot_steps)
// Add the valueline path.
energy_line.datum(data1)
energy_line.attr("d", valueline)
pointposition(temp, energy_gap, plot_steps)

}

// -----------------------------------------
// Initialize slider values
// ----------------------------------------
energy_slider(5)
temp_slider(0.5)
