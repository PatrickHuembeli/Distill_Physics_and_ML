var energy_figure_id = "#energy_landscape_figure_id"

// 2. Use the margin convention practice 
var margin = {top: 0, right: 50, bottom: 50, left: 20}

var element = document.getElementById("energy_landscape");
var positionInfo = element.getBoundingClientRect();
var height_new = positionInfo.height;
var width_new = positionInfo.width;

// The number of datapoints for the graph
var n = 32;
// The number of actual points for images
var n_points = 6;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width_new-margin.right]); // output

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([height_new, 0]); // output 

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(0.3,0.6)() } })
var points_data = [8,24]

//for (i=0; i<Math.floor(n/n_points); i++) {points_data.push(i*Math.floor(n/n_points)+1)}

console.log(points_data)
// 1. Add the SVG to the page and employ #2
var svg = d3.select(energy_figure_id).append("svg")
    .attr("width", width_new)
    .attr("height", height_new)
  .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Random initial positions
var images_list = [0,1]; 
image_for_node = svg.append('image')
    .attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+images_list[0]+'.jpg')
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 50)
    .attr("height", 50)

// 3. Call the x axis in a group tag
//svg.append("g")
//    .attr("class", "x axis")
//    .attr("transform", "translate(0," + height + ")")
//    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
//svg.append("g")
//    .attr("class", "y axis")
//    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator 
line_energy = svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "plotline") // Assign a class for styling 
    .attr("d", line)
	.style("stroke", "blue")
	.style("fill", "none" ); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
circle_energy = svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5)
    .attr("id", function(d,i){return "noisy_images"+i})
	.on("click", function(d,i){
		    		image_for_node.attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg')	})
	.on("mouseover", function(d,i){
		    		image_for_node.attr('xlink:href', '/figures/images_with_gaussian_noise/noisy_image_'+i+'.jpg')	})
   
for (j=0;j<points_data.length;j++){
	element = d3.select("#"+"noisy_images"+points_data[j])
	console.log(element)
	element.style("fill", "red")
	element.attr("r", 5)

}
neighbour1 = [5,6,7,8,9,10,11]
neighbour2 = [21,22,23,24,25,26,27]
learning_steps = 0
unlearning_steps = 0
learn_adjust = 0.1
unlearn_adjust = 0.05

function learn_phase(){
	if (dataset[8].y- learn_adjust*Math.exp(-Math.abs(8-neighbour1[3])/2)>0.001){ 
	// This if loop checks that the red dot never goes outside the image
		for (j=0; j<neighbour1.length;j++){
			dataset_update1 =  dataset[neighbour1[j]].y- learn_adjust*Math.exp(-Math.abs(8-neighbour1[j])/2)//*Math.exp(-learning_steps/4)
			console.log(dataset_update1, neighbour1[3])
			dataset[neighbour1[j]].y = dataset_update1}}
	if (dataset[24].y- learn_adjust*Math.exp(-Math.abs(24-neighbour2[3])/2)>0){ 
	for (j=0; j<neighbour2.length;j++){
		dataset_update2 =  dataset[neighbour2[j]].y- learn_adjust*Math.exp(-Math.abs(24-neighbour2[j])/2)//*Math.exp(-learning_steps/4)
		dataset[neighbour2[j]].y = dataset_update2}}	
	update_line()
	learning_steps +=1
}

function unlearn_phase(){
	minimas = find_local_minima()
	minimas.forEach(
		function(element){
			dataset[element].y = dataset[element].y + unlearn_adjust//*Math.exp(-unlearning_steps/4)
		}
	) 
	unlearning_steps +=1
	update_line()
}

function reinitialize_phase(){
	learning_steps = 0
	unlearning_steps = 0
	dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(0.3,0.6)() } })
	update_line()
}

function update_line(){
line_energy.datum(dataset)
	.transition().duration(4000)
    .attr("d", line)

circle_energy.data(dataset).transition()
	.attr("cy", function(d){return yScale(d.y)}).duration(4000)
}

function find_local_minima(){
	minima_idx = []
	a = dataset[0].y
	for (j=1;j<n-1;j++){
		b= dataset[j].y
		c= dataset[j+1].y
	if (b<a){
		if(b<c){
		minima_idx.push(j)}}
	a = dataset[j].y}
	return minima_idx
}

console.log(points_data[0])
tester = find_local_minima()
console.log(tester)
