const identity_img_equil = "#image_equilibration_id"

var margin = {right: 50, left: 50}, // position of slider in color field
    width = 700
    height = 550

var svg_imgequil = d3.select(identity_img_equil)
    .append("svg")
    .attr('id', 'main_svg_imag_equil')
    .attr('class','figures')
    .attr("width", width)
    .attr("height", height);

var img_width = 80 // This is the size of the image in the svg
    img_height = 80
    img_margin = 10

var main_img_width = 128
    main_img_height = 128

var compressed_size = 10,
    canvas_width = 10,
    canvas_height = 20,
    neuron_margin_x = 20,
    neuron_radius = 10;

var distance_hidden = 230 // how far are hidden and visible appart

var which_number_index = 0 // defines what number is highlighted (0,1 or 9))
var total_equilibration_steps = 1
var which_equilibration_step_hidden = 1 // how many equil steps have been done.
var which_equilibration_step_visible = 1 // how many equil steps have been done.
var max_equilibration_steps = 16
// ----------------------------------------------------

img_nr = [0,1,2,3,4,6]
number_of_images = [0,1,2] // So far we onl have zero, one, nine

// ADD A SINGLE IMAGE
var main_image_var = img_nr[0] // define variable globaly   
var folder_path = '/figures/images_for_equilibration/'
var folder_nr = ['zero/', 'four/', 'nine/']
var images_visible = ['damaged_zeros_visible_','damaged_fours_visible_','damaged_nines_visible_']
var images_hidden = ['resized_damaged_zeros_hidden_','resized_damaged_fours_hidden_','resized_damaged_nines_hidden_']
var image_nr = [0,1,2,3,4,5,6,7,8]

//main_image = svg_imgequil.append('image')
//    .attr('id', 'main_img_big_id')
//    .attr('xlink:href', folder_path+folder_nr[0] + images_visible[0] +0+'.jpg')
//    .attr("x", 500)
//    .attr("y", 20)
//    .attr("width", main_img_width)
//    .attr("height", main_img_height)
    
compressed_image = svg_imgequil.append('image')
    .attr('id', 'compressed_img_id')
    .attr('xlink:href', folder_path+folder_nr[0]+'resized_'+images_visible[0]+0+'.jpg')
    .attr("x", 50)
    .attr("y", 350)
    .attr("width", img_width)
    .attr("height", img_height)

hidden_compressed_image = svg_imgequil.append('image')
    .attr('id', 'hidden_compressed_img_id')
    .attr('xlink:href', folder_path+folder_nr[0]+images_hidden[0]+0+'.jpg')
    .attr("x", 100)
    .attr("y", 500)
    .attr("width", img_width/2)
    .attr("height", img_height/2)

// This lines make the images invisible
document.getElementById("hidden_compressed_img_id").style.display = "none";
document.getElementById("compressed_img_id").style.display = "none";

path_for_pixel =  folder_path+'zero/resized_damaged_zeros_visible_'+main_image_var+'.jpg'


const every_nth_main = (arr, nth) => arr.filter((e, i) => i % nth === 0);
const bigger_than_n_main = (arr, n) => arr.filter((e, i) => e > 10);

function binarizeArray(array, bigger_than_value){
	new_array = []
	for (i=0; i<array.length; i++) {
		if (array[i]>bigger_than_value){
		new_array.push(1)
		}
		else{new_array.push(0)}
	}
	return new_array}	

images = svg_imgequil.selectAll()
    .data(number_of_images)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return folder_path +folder_nr[d]+images_visible[d] +0+'.jpg'})
    .attr("x", function(d, i){return 200+ img_width*i + i*img_margin})
    .attr("y", 20) 
    .attr("width", img_width)
    .attr("height", img_height)
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})  
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})  
    .on("click", function(d){main_image_var = d,
		//path_vis = folder_path +folder_nr[d]+images_visible[d]+0+'.jpg',
	        //console.log(path_vis),    
                //d3.select('#main_img_big_id').attr('xlink:href', path_vis),
                d3.select('#compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+'resized_'+images_visible[d]+0+'.jpg')
                d3.select('#hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+images_hidden[d]+0+'.jpg')
	        which_number_index = d
	        total_equilibration_steps = 1
                initialize_NN()
    		});



var hidden_container = svg_imgequil.append("svg")
    .attr("x", 350)
    .attr("y", 210)
    .attr("width", 500)
    .attr("height", 500)
    .attr('id','HiddenContainer'); 
    
var NN_container = svg_imgequil.append("svg")
    .attr("x", 120)
    .attr("y", 210)
    .attr("width", 500)
    .attr("height", 800)
    .attr('id','NNContainer'); 

var Energy_Plot_Container = svg_imgequil.append("svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 200)
    .attr('id','NNContainer')
// Transform compressed image to neural network
// -----------------------------------------------------------------------------
// Define global variables
//var img, context, imgData, raw_data1, raw_data
var colors = ['white', 'black'];
var hidden_colors = ['hsl(240, 100%, 84%)', 'hsl(0, 100%, 84%)'];
var hidden_colors_stroke = ["blue", "red"]
var initialize_flag = false
//context = canvas.node().getContext("2d");


function getwholeImage_new(url, threshold) {
  var img = new Image();
  img.src = url;
  var canvas = document.createElement('canvas');
  canvas.width = compressed_size
  canvas.height = compressed_size
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  data_image_full = context.getImageData(0, 0, canvas.width, canvas.height).data
  data_image_one_channel = every_nth_main(data_image_full, 4)
  raw_data = binarizeArray(data_image_one_channel, threshold) // This value gives threshold for black and white	
  var points = [];
  for (var s=0; s<compressed_size*compressed_size; s++){
  	x = s % compressed_size,
        y = Math.floor(s/compressed_size),
	c = raw_data[s],
	points.push([x,y,c]) ; 
  }
  return points }

function equilibration_step_rbm(){
	//console.log('test')
        //d3.select('#main_img_big_id').attr('xlink:href', folder_path +folder_nr[which_number_index]+images_visible[which_number_index]+Math.floor(total_equilibration_steps/2)+'.jpg')
        d3.select('#compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+'resized_'+images_visible[which_number_index]+Math.floor(total_equilibration_steps/2)+'.jpg')
        d3.select('#hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+images_hidden[which_number_index]+Math.ceil(total_equilibration_steps/2)+'.jpg')
	if (total_equilibration_steps < max_equilibration_steps){
	total_equilibration_steps += 1}
	console.log(total_equilibration_steps)
	initialize_NN()
}


//var which_number_index = 0 // defines what number is highlighted (0,1 or 9))
//var which_equilibration_step = 0 // how many equil steps have been done.

async function update_drawing() {
    await new Promise(r => setTimeout(r, 200)); // Wait a short time until data is really loaded.
    
points = getwholeImage_new(d3.select('#compressed_img_id').attr('xlink:href'), 100)	
hidden_points = getwholeImage_new(d3.select('#hidden_compressed_img_id').attr('xlink:href'), 20)	
    if (initialize_flag){
        d3.selectAll(".weightline1")
            //.data(points)
	    .transition()
	    .duration(100) 
            .attr('stroke', 'blue')
	    .attr('opacity', '0.1')
	    .transition()
            .duration(2000)
            .attr('stroke', 'black')
	    .attr('opacity', '0.1')

	d3.selectAll(".visible_units_circles")
            .data(points)
	    .transition()
	    .duration(2000)
            .style("fill", function(d) { return colors[d[2]] })
        
   if (total_equilibration_steps%2 == 1 ){
	   console.log("even")
    	d3.selectAll('.equilibrationcircles')
	        .attr("opacity", 0.1)
	        .transition().duration(2000)
            	.attr('cx', function(d){return (10 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            //.attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            	.attr('cy', function(d){return (10+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            //.attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
	    }
   else {console.log("odd")
    	d3.selectAll('.equilibrationcircles')
	        .transition().duration(2000)
            	//.attr('cx', function(d){return (10 +  neuron_margin_x*points[0][0] - 5*points[0][0] )})
            	.attr('cx', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            	//.attr('cy', function(d){return (10+neuron_margin_x*points[0][1]+ 5*points[0][0] )})
            	.attr('cy', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
	        .transition().duration(1000).attr("opacity",0.0)
	   }

        d3.select("#HiddenContainer").selectAll("circle")
	.data(hidden_points)   
        .transition()
        .duration(2000)
        .style("fill", function(d) { return hidden_colors[d[2]]}) 
        .style("stroke", function(d){return hidden_colors_stroke[d[2]]});

       circle_energy_equilbration.attr("cx", x_scale_eq_plot(total_equilibration_steps) )
    		.attr("cy", y_scale_eq_plot(plot_eq_energy_data[total_equilibration_steps].y))
    		.attr("r", 4)
    }
    else{ // This is for the first run
   
   // Add lines for connection
    d3.select("#NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("line")
	    .attr("class", "weightline1")
            .attr('x1', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            .attr('x2', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            .attr('y2', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', 'black')
            .attr('opacity', '0.1')
    // Lines for lower nodes
    d3.select("#NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("circle")
	    .attr("class", "equilibrationcircles")
            .attr('cx', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            //.attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('cy', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            //.attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('fill', 'blue')
	    .attr('r', 8)
            .attr('opacity', '0.1')
    // Add visible nodes
   d3.select("#NNContainer").selectAll()
        .data(points)
        .enter()
        .append("circle")
	.attr("cx", 5)
	.attr("cy", 5)    
	.attr("class", "visible_units_circles")    
        .style("fill", function(d) { return colors[d[2]]})
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0] - 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)
        .attr("stroke", "black")
        .attr("opacity", 1.0)
        initialize_flag = true
    
       // Add hidden nodes
    d3.select("#HiddenContainer").selectAll()
        .data(hidden_points)
        .enter()
        .append("circle")        
	.attr("cx", 5)
	.attr("cy", 5)    
        .attr("class", "hidden_nodes")
        .style("fill", function(d) { return hidden_colors[d[2]]}) 
	.style("stroke", function(d){return hidden_colors_stroke[d[2]]})
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0]- 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)  
        //.attr("opacity", 0.5) 
        
        }
}

async function initialize_NN() {

    img = document.getElementById("compressed_img_id")
    try {
    update_drawing();}
    catch {return 'error'} // Wait for short time to load img
}

initialize_NN()

// Append Energy Curve
// The number of datapoints for the graph
var number_of_steps = max_equilibration_steps*2;
// The number of actual points for images
var n_points = 6;
var margin_energy_plot = 10

// 5. X scale will use the index of our data
var x_scale_eq_plot = d3.scaleLinear()
    .domain([0, number_of_steps-1]) // input
    .range([margin_energy_plot, Energy_Plot_Container.attr("width")-2*margin_energy_plot]); // output

// 6. Y scale will use the randomly generate number 
var y_scale_eq_plot = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([Energy_Plot_Container.attr("height")-2*margin_energy_plot, margin_energy_plot]); // output 

//console.log(height_new)
// 7. d3's line generator
var plot_eq_energy_line = d3.line()
    .x(function(d, i) { return x_scale_eq_plot(i); }) // set the x values for the line generator
    .y(function(d) { return y_scale_eq_plot(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.4*Math.cos(d/number_of_steps*Math.PI*2)+0.45 } })

strokewidth_eq_plot = 2
energy_plot_frame = Energy_Plot_Container.append("rect")
	.attr("x", 2*strokewidth_eq_plot)
	.attr("y", 2*strokewidth_eq_plot)
	.attr("rx", 20)
    	.attr("ry", 20)
	.attr("width", Energy_Plot_Container.attr("width")-20)
	.attr("height", Energy_Plot_Container.attr("height")-20)
	.attr("fill", "none")
	.attr("stroke-width", strokewidth_eq_plot)
        .attr("stroke", "grey")
	.attr("stroke-opacity", 0.5);

line_energy_2 = Energy_Plot_Container.append("path")
    .datum(plot_eq_energy_data) // 10. Binds data to the line 
    .attr("class", "plotline") // Assign a class for styling
    .attr("d", plot_eq_energy_line)
	.style("stroke", "blue")
	.style("stroke-opacity", 0.3)

circle_energy_equilbration = Energy_Plot_Container.append("circle") // Uses the enter().append() method
    //.attr("class", "dot") // Assign a class for styling
    .attr("cx", x_scale_eq_plot(total_equilibration_steps) )
    .attr("cy", y_scale_eq_plot(plot_eq_energy_data[total_equilibration_steps].y))
    .attr("r", 4)
    .attr("fill", "blue")
    .attr("opacity", 0.8)

console.log(x_scale_eq_plot(1))
console.log(x_scale_eq_plot(2), y_scale_eq_plot(plot_eq_energy_data[2].y))
