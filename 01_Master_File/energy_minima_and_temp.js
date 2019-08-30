const energy_minima_temp_id = "#energy_minima_and_temp_id"

// 2. Use the margin convention practice 
var margin = {top: 0, right: 50, bottom: 50, left: 20}

var element = document.getElementById("Figure_energy_minima_and_temp");
var positionInfo = element.getBoundingClientRect();
var height_new = positionInfo.height;
var width_new = positionInfo.width;

temp_slider_energy_minim_init_value = 10

document.getElementById("temperature_slider_energy_minima").innerHTML = temp_slider_energy_minim_init_value;
//document.getElementById("coupling_strength").value = temp_slider_energy_minim_init_value

// The number of datapoints for the graph
var n = 32;
// The number of actual points for images
var n_points = 6;

// 5. X scale will use the index of our data
var x_scale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([5, width_new-margin.right]); // output

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
var plot_data = d3.range(n).map(function(d) { 
	return {"y":0.35*Math.cos(d/n*Math.PI*4)-0.2*d/n+0.54 , "c":0} })

plot_data[0].c = 0

// 1. Add the SVG to the page and employ #2
var svg_2 = d3.select(energy_minima_temp_id).append("svg")
    .attr("width", width_new)
    .attr("height", height_new)
  //.append("g")
   //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

image_for_node_2 = svg_2.selectAll(".images")
	.data(plot_data).enter()
	.append('image')
	.attr("class", "energy_min_images")
	.attr("id", function(d,i){return "energy_min_img"+i})
    	.attr('xlink:href', function(d,i){
		return '/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg'})
    	.attr("x", function(d,i){
		return 65})
    	.attr("y", 20)
    	.attr("width", 70)
    	.attr("height", 70)
	.attr("opacity", 0)

d3.select("#energy_min_img0").attr("opacity", 1.0)


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
	  append_rect(max_opacity-0.0075*i, x, y, stepsize, 400)
	}
}

make_temp_gradient(0, height_new, 150, 5)
//make_temp_gradient(250, height_new-10, 100, 5)



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
    .attr("fill", "#ffab00")
    .attr("id", function(d,i){return "configuration"+i})
      .on("mouseover", function(d,i){
	      d3.selectAll(".energy_min_images").transition().duration(500).attr("opacity", 0)
	      d3.select("#energy_min_img"+i).transition().duration(500).attr("opacity", 1.0)
      })
      .on("click", function(d,i){start_convergence(i, 32, true)})

function convergence_hopfield(position, min1, min2, max){
	// The minimas and maximas are hardcoded
	min1 = 8
	max = 16
	min2 = 24
	if(position<max){position += Math.sign(min1-position)} 	    //go to min1
	else {  if(position==max){ position+= Math.sign(Math.random()-0.5)} // exception for position = max
		else{position += Math.sign(min2-position)} // go to min2
	}
	return position
}

function convergence_inverse_hopfield(position, n, min1, min2, max){
	// The minimas and maximas are hardcoded
	min1 = 8
	max = 16
	min2 = 24
	if (position>0&&position<n-1){
	if(position<max){if(position==min1){ position+= Math.sign(Math.random()-0.5) }
			 else {position += Math.sign(-min1+position)}} 	    //go to min1
	else {  	 if(position==max||position==min2){ position+= Math.sign(Math.random()-0.5)} // exception for position = max
			 else{position += Math.sign(-min2+position)} // go to min2
	}}
	return position
}

function convergence_boltzmann(position, T, n,min1, min2, max){
	if (Math.exp(-1/T)<Math.random()*2){
	position = convergence_hopfield(position)}
	else {position = convergence_inverse_hopfield(position, n)}
	return position
}

var time_steps = 2000


function draw_red_dot(iterator, pos_list){
	end = pos_list.length
	if(iterator==end){return}
	else {	
	a = pos_list[iterator]
	selected_circle = d3.select("#configuration"+a)
	selected_image = d3.select("#energy_min_img"+a)	
	d3.selectAll(".energy_min_images").transition().delay(iterator*time_steps).duration(time_steps)
			.attr("opacity", 0)
	selected_image.transition().delay(iterator*time_steps).duration(time_steps)
			.attr("opacity", 1.0)
	selected_circle.transition().delay(iterator*time_steps).duration(time_steps)
			.attr("fill", "red")
			.attr("r", 5.0)	
			.transition().duration(time_steps)
			.attr("fill", "#ffab00")
			.attr("r", 4.0);
	iterator += 1
	d3.select("#configuration"+a)
				.on("end", draw_red_dot(iterator, pos_list))
	}
}

//const sleep = (milliseconds) => {
//  return new Promise(resolve => setTimeout(resolve, milliseconds))
//}
//
//async function sequence(iterator, pos_list) {
//  await sleep(time_steps/2)
//  for (i=1;i<pos_list.length;i++){
//  a = pos_list[i]
//  await sleep(time_steps); // Wait 50ms…
//  image_for_node_2.attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+a+'.jpg'); 
//  }
//}
//
//
//function draw_images(iterator, pos_list){
//	end = pos_list.length
//	if(iterator==end){return}
//	else {
//	console.log(iterator)	
//	a = pos_list[iterator]
//	iterator += 1
//	image_for_node_2.transition().delay(iterator*time_steps).duration(time_steps).attr("opacity", 0.0);
//	image_for_node_2.attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+a+'.jpg'); 
//	image_for_node_2.transition().duration(time_steps).attr("opacity", 1.0);
//	//imgage_for_node_2.transition().duration(5000).ease(d3.easeLinear).attr("opacity", 1)	
//	image_for_node_2.on("end", draw_images(iterator, pos_list));	
//	}
//}

function start_convergence(a, number_of_images, boltzmann){
	T = document.getElementById("temperature_slider_energy_minima").innerHTML 
	d3.selectAll(".dot").interrupt()
			.attr("fill", "#ffab00")
			.attr("r", 4.0);
	d3.select(".energy_min_images").interrupt()
	pos_list = [a]
	pos = a
	for(i=1;i<20;i++){
   		pos = convergence_boltzmann(pos, T, number_of_images)
		pos_list.push(pos)}
	//sequence(0, pos_list)
	draw_red_dot(0, pos_list)
	//draw_images(0, pos_list)
}

function temp_slider_energy_min(val){
	document.getElementById("temperature_slider_energy_minima").innerHTML = x_temp_energy(val).toPrecision(2);
	d3.selectAll(".energy_min_images").interrupt()
	d3.selectAll(".dot").interrupt()
			.attr("fill", "#ffab00")
			.attr("r", 4.0);
}

var x_temp_energy = d3.scalePow()
     .exponent(2)
     .domain([0.01, 100])
     .range([0.1, 10.05])
     .clamp(true);

pos = 15
for(i=1;i<20;i++){
   pos = convergence_boltzmann(pos, 0.5, 32)
	console.log(pos)}

function interrupt_convergence(val){
	console.log("test")
	d3.selectAll(".dot").interrupt()
			.attr("fill", "#ffab00")
			.attr("r", 4.0);
} 
