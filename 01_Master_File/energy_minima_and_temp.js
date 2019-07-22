const energy_minima_temp_id = "#energy_minima_and_temp_id"

// 2. Use the margin convention practice 
var margin = {top: 0, right: 50, bottom: 50, left: 20}

var element = document.getElementById("Figure_energy_minima_and_temp");
var positionInfo = element.getBoundingClientRect();
var height_new = positionInfo.height;
var width_new = positionInfo.width;

// The number of datapoints for the graph
var n = 32;
// The number of actual points for images
var n_points = 6;

// 5. X scale will use the index of our data
var x_scale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width_new-margin.right]); // output

// 6. Y scale will use the randomly generate number 
var y_scale = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([height_new, 0]); // output 

//console.log(height_new)
// 7. d3's line generator
var plot_line = d3.line()
    .x(function(d, i) { return x_scale(i); }) // set the x values for the line generator
    .y(function(d) { return y_scale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var plot_data = d3.range(n).map(function(d) { return {"y":0.4*Math.cos(d/n*Math.PI*4)+0.45 } })


// 1. Add the SVG to the page and employ #2
var svg_2 = d3.select(energy_minima_temp_id).append("svg")
    .attr("width", width_new)
    .attr("height", height_new)
  //.append("g")
   //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

image_for_node_2 = svg_2.append('image')
    .attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+1+'.jpg')
    .attr("x", 65)
    .attr("y", 20)
    .attr("width", 70)
    .attr("height", 70)

line_energy_2 = svg_2.append("path")
    .datum(plot_data) // 10. Binds data to the line 
    .attr("class", "plotline") // Assign a class for styling 
    .attr("d", plot_line)
	.style("stroke", "blue")
	.style("fill", "none" ); // 11. Calls the line generator 

function make_temp_gradient(x_bottom, y_bottom, total_height, stepsize){
	color = "blue"
	max_opacity = 0.2
	for (i=1; i<Math.floor(total_height/stepsize); i++){
	  y = y_bottom - i*stepsize
	  x = x_bottom	
	  append_rect(max_opacity-0.01*i, x, y, stepsize, 100)
	}
}

make_temp_gradient(50, height_new-10, 100, 5)
make_temp_gradient(250, height_new-10, 100, 5)

function append_rect(opacity, x, y, height, width){
	svg_2.append("rect")
	.attr("id", "temp_rectangle")
	.attr("x", x)
	.attr("y", y)
	.attr("height", height)
	.attr("width", width)
	.style("fill", color)
	.style("opacity", opacity)
}

//svg_2.append("rect")
//	.attr("id", "temp_rectangle")
//	.attr("x", 50)
//	.attr("y", 0.8*height_new)
//	.attr("height", 50)
//	.attr("width", 100)
//	.style("fill", "blue")
//	.style("opacity", 0.1)
// 12. Appends a circle for each datapoint 
circle_energy_2 = svg_2.selectAll(".dot")
    .data(plot_data)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return x_scale(i) })
    .attr("cy", function(d) { return y_scale(d.y) })
    .attr("r", 4)
    .attr("id", function(d,i){return "configuration"+i})
      .on("mouseover", function(d,i){image_for_node_2.attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg')   })


