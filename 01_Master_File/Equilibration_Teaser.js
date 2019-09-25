const identity_img_teaser = "#Equilibration_Img_Teaser"

var width = 800
    height = 300

var teaser_svg_imgequil = d3.select(identity_img_teaser)
    .append("svg")
    .attr('id', 'teaser_main_svg_imag_equil')
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
var teaser_total_equilibration_steps = 1
var which_equilibration_step_hidden = 1 // how many equil steps have been done.
var which_equilibration_step_visible = 1 // how many equil steps have been done.
var max_equilibration_steps = 16
// ----------------------------------------------------

img_nr = [0,1,2,3,4,6]
number_of_images = [0,1,2] // So far we onl have zero, one, nine

// ADD A SINGLE IMAGE
var teaser_main_image_var = img_nr[0] // define variable globaly   
var folder_path = '/figures/images_for_equilibration/'
var folder_nr = ['zero/', 'four/', 'nine/']
var images_visible = ['damaged_zeros_visible_','damaged_fours_visible_','damaged_nines_visible_']
var images_hidden = ['resized_damaged_zeros_hidden_','resized_damaged_fours_hidden_','resized_damaged_nines_hidden_']
var image_nr = [0,1,2,3,4,5,6,7,8]

teaser_svg_imgequil.append('image')
    .attr('id', 'teaser_main_img_big_id')
    .attr('xlink:href', folder_path+folder_nr[0] + images_visible[0] +0+'.jpg')
    .attr("x", 500)
    .attr("y", 20)
    .attr("width", main_img_width)
    .attr("height", main_img_height)
    .attr("opacity", 0.0)
    
teaser_compressed_image = teaser_svg_imgequil.append('image')
    .attr('id', 'teaser_compressed_img_id')
    .attr('xlink:href', folder_path+folder_nr[0]+'resized_'+images_visible[0]+0+'.jpg')
    .attr("x", 50)
    .attr("y", 350)
    .attr("width", img_width)
    .attr("height", img_height)

teaser_hidden_compressed_image = teaser_svg_imgequil.append('image')
    .attr('id', 'teaser_hidden_compressed_img_id')
    .attr('xlink:href', folder_path+folder_nr[0]+images_hidden[0]+0+'.jpg')
    .attr("x", 100)
    .attr("y", 500)
    .attr("width", img_width/2)
    .attr("height", img_height/2)

// This lines make the images invisible
document.getElementById("teaser_hidden_compressed_img_id").style.display = "none";
document.getElementById("teaser_compressed_img_id").style.display = "none";

path_for_pixel =  folder_path+'zero/resized_damaged_zeros_visible_'+teaser_main_image_var+'.jpg'


const teaser_every_nth = (arr, nth) => arr.filter((e, i) => i % nth === 0);
const bigger_than_n = (arr, n) => arr.filter((e, i) => e > 10);

function binarizeArray(array, bigger_than_value){
	new_array = []
	for (i=0; i<array.length; i++) {
		if (array[i]>bigger_than_value){
		new_array.push(1)
		}
		else{new_array.push(0)}
	}
	return new_array}	

teaser_images = teaser_svg_imgequil.selectAll()
    .data(number_of_images)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return folder_path +folder_nr[d]+images_visible[d] +0+'.jpg'})
    .attr("x", 0)
    .attr("y", function(d,i){return img_width*i + img_margin*i}) 
    .attr("width", img_width)
    .attr("height", img_height)
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})  
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})  
    .on("click", function(d){teaser_main_image_var = d,
		path_vis = folder_path +folder_nr[d]+images_visible[d]+0+'.jpg',
	        console.log(path_vis),    
                d3.select('#teaser_main_img_big_id').attr('xlink:href', path_vis),
                d3.select('#teaser_compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+'resized_'+images_visible[d]+0+'.jpg')
                d3.select('#teaser_hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+images_hidden[d]+0+'.jpg')
	        which_number_index = d
	        teaser_total_equilibration_steps = 1
                teaser_initialize_NN()
    		});



var hidden_container = teaser_svg_imgequil.append("svg")
    .attr("x", 350)
    .attr("y", 0)
    .attr("width", 500)
    .attr("height", 500)
    .attr('id','teaser_HiddenContainer'); 
    
var NN_container = teaser_svg_imgequil.append("svg")
    .attr("x", 120)
    .attr("y", 0)
    .attr("width", 500)
    .attr("height", 800)
    .attr('id','teaser_NNContainer'); 

var teaser_Energy_Plot_Container = teaser_svg_imgequil.append("svg")
    .attr("x", 550)
    .attr("y", 50)
    .attr("width", 200)
    .attr("height", 200)
    .attr('id','teaser_Energy_Container')
// -----------------------------------------------------------------------------
var colors = ['white', 'black'];
var hidden_colors = ['hsl(240, 100%, 84%)', 'hsl(0, 100%, 84%)'];
var hidden_colors_stroke = ["blue", "red"]
var initialize_flag = false

function getwholeImage_new(url, threshold) {
  var img = new Image();
  img.src = url;
  var teaser_canvas = document.createElement('canvas');
  teaser_canvas.width = compressed_size
  teaser_canvas.height = compressed_size
  var context = teaser_canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  imgData = context.getImageData(0, 0, teaser_canvas.width, teaser_canvas.height)
  data_image_full = context.getImageData(0, 0, teaser_canvas.width, teaser_canvas.height).data
  data_image_one_channel = teaser_every_nth(data_image_full, 4)
  raw_data = binarizeArray(data_image_one_channel, threshold) // This value gives threshold for black and white	
  var points = [];
  for (var s=0; s<compressed_size*compressed_size; s++){
  	x = s % compressed_size,
        y = Math.floor(s/compressed_size),
	c = raw_data[s],
	points.push([x,y,c]) ; 
  }
  return points }

function teaser_equilibration_step_rbm(){
        //d3.select('#teaser_main_img_big_id').attr('xlink:href', folder_path +folder_nr[which_number_index]+images_visible[which_number_index]+Math.floor(teaser_total_equilibration_steps/2)+'.jpg')
        d3.select('#teaser_compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+'resized_'+images_visible[which_number_index]+Math.floor(teaser_total_equilibration_steps/2)+'.jpg')
        d3.select('#teaser_hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+images_hidden[which_number_index]+Math.ceil(teaser_total_equilibration_steps/2)+'.jpg')
	if (teaser_total_equilibration_steps < max_equilibration_steps){
	teaser_total_equilibration_steps += 1}
	teaser_initialize_NN()
}

teaser_time_steps = 2000

async function teaser_update_drawing() {
    await new Promise(r => setTimeout(r, 200)); // Wait a short time until data is really loaded.
//console.log(d3.select('#teaser_compressed_img_id').attr('xlink:href'))    
points = getwholeImage_new(d3.select('#teaser_compressed_img_id').attr('xlink:href'), 100)	
hidden_points = getwholeImage_new(d3.select('#teaser_hidden_compressed_img_id').attr('xlink:href'), 20)
    if (initialize_flag){
        d3.selectAll(".teaser_weightline1")
            //.data(points)
	    .transition()
	    .duration(100) 
            .attr('stroke', 'blue')
	    .attr('opacity', '0.1')
	    .transition()
            .duration(teaser_time_steps)
            .attr('stroke', 'black')
	    .attr('opacity', '0.1')
	
	d3.selectAll(".teaser_visible_units_circles")
            .data(points)
	    .transition()
	    .duration(teaser_time_steps)
            .style("fill", function(d) { return colors[d[2]] });
        
   if (teaser_total_equilibration_steps%2 == 1 ){
    	d3.selectAll('.teaser_equilibrationcircles')
	   	.attr("opacity", 0.1)
	        .transition().duration(teaser_time_steps)
            	.attr('cx', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            //.attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            	.attr('cy', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            //.attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
	    }
   else {d3.selectAll('.teaser_equilibrationcircles')
	        .transition().duration(teaser_time_steps)
            	//.attr('cx', function(d){return (10 +  neuron_margin_x*points[0][0] - 5*points[0][0] )})
            	.attr('cx', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            	//.attr('cy', function(d){return (10+neuron_margin_x*points[0][1]+ 5*points[0][0] )})
            	.attr('cy', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
	        .transition().duration(teaser_time_steps/2).attr("opacity", 0.0)
	   }

        d3.select("#teaser_HiddenContainer").selectAll("circle")
	.data(hidden_points)   
        .transition()
        .duration(teaser_time_steps)
        .style("fill", function(d) { return hidden_colors[d[2]]})
	.style("stroke", function(d){return hidden_colors_stroke[d[2]]})    
       teaser_circle_energy_equilbration.attr("cx", x_scale_eq_plot(teaser_total_equilibration_steps) )
    		.attr("cy", y_scale_eq_plot(plot_eq_energy_data[teaser_total_equilibration_steps].y))
    		.attr("r", 4)
    }
    else{ // This is for the first run
   
   // Add lines for connection
    d3.select("#teaser_NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("line")
	    .attr("class", "teaser_weightline1")
            .attr('x1', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            .attr('x2', function(d){return (15 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            .attr('y2', function(d){return (15+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', 'black')
            .attr('opacity', '0.1')
    // Lines for lower nodes
    d3.select("#teaser_NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("circle")
	    .attr("class", "teaser_equilibrationcircles")
            .attr('cx', function(d){return (15 +  neuron_margin_x*points[45][0] - 5*points[45][0] )})
            //.attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('cy', function(d){return (15+neuron_margin_x*points[45][1]+ 5*points[45][0] )})
            //.attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('fill', 'blue')
	    .attr('r', 8)
            .attr('opacity', '0.1')
    // Add visible nodes
   d3.select("#teaser_NNContainer").selectAll()
        .data(points)
        .enter()
        .append("circle")
	.attr("class", "teaser_visible_units_circles")  
	.attr("cx", 5)
	.attr("cy", 5)    
        .style("fill", function(d) { return colors[d[2]]})
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0] - 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)
        .attr("stroke", "black")
        //.attr("opacity", 1.0)
        initialize_flag = true
    
       // Add hidden nodes
    d3.select("#teaser_HiddenContainer").selectAll()
        .data(hidden_points)
        .enter()
        .append("circle")        
        .attr("class", "teaser_hidden_nodes")
	.attr("cx", 5)
	.attr("cy", 5)    
        .style("fill", function(d) { return hidden_colors[d[2]]})
	.style("stroke", "blue")    
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0]- 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)     

     d3.select("#teaser_NNContainer").append("rect")
	    .attr("x", 0)
	    .attr("y", -5)
	    .attr("width", 175)
	    .attr("height", 200)
	    .attr("opacity", 0.0)
	    .attr("transform", "rotate(18), skewX(18)")
	    .on("click", function(){if (teaser_total_equilibration_steps%2 == 1 ){
teaser_equilibration_step_rbm()}})
     d3.select("#teaser_NNContainer").append("rect")
	    .attr("x", 240)
	    .attr("y", -75)
	    .attr("width", 175)
	    .attr("height", 200)
	    .attr("opacity", 0.0)
	    .attr("transform", "rotate(18), skewX(18)")
	    .on("click", function(){if (teaser_total_equilibration_steps%2 == 0 ){
teaser_equilibration_step_rbm()}})
        }
}

async function teaser_initialize_NN() {

    img = document.getElementById("teaser_compressed_img_id")
    try {
    teaser_update_drawing();}
    catch {return 'error'} // Wait for short time to load img
}

teaser_initialize_NN()

// Append Energy Curve
// The number of datapoints for the graph
var number_of_steps = max_equilibration_steps*2;
// The number of actual points for images
var n_points = 6;
var margin_energy_plot = 10

// 5. X scale will use the index of our data
var x_scale_eq_plot = d3.scaleLinear()
    .domain([0, number_of_steps-1]) // input
    .range([margin_energy_plot, teaser_Energy_Plot_Container.attr("width")-2*margin_energy_plot]); // output

// 6. Y scale will use the randomly generate number 
var y_scale_eq_plot = d3.scaleLinear()
    .domain([0, 1]) // input 
    .range([teaser_Energy_Plot_Container.attr("height")-2*margin_energy_plot, margin_energy_plot]); // output 

//console.log(height_new)
// 7. d3's line generator
var plot_eq_energy_line = d3.line()
    .x(function(d, i) { return x_scale_eq_plot(i); }) // set the x values for the line generator
    .y(function(d) { return y_scale_eq_plot(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var plot_eq_energy_data = d3.range(number_of_steps).map(function(d) { return {"y":0.4*Math.cos(d/number_of_steps*Math.PI*2)+0.45 } })

strokewidth_eq_plot = 2
energy_plot_frame = teaser_Energy_Plot_Container.append("rect")
	.attr("x", 2*strokewidth_eq_plot)
	.attr("y", 2*strokewidth_eq_plot)
	.attr("rx", 20)
    	.attr("ry", 20)
	.attr("width", teaser_Energy_Plot_Container.attr("width")-20)
	.attr("height", teaser_Energy_Plot_Container.attr("height")-20)
	.attr("fill", "none")
	.attr("stroke-width", strokewidth_eq_plot)
        .attr("stroke", "grey")
	.attr("stroke-opacity", 0.5);

line_energy_2 = teaser_Energy_Plot_Container.append("path")
    .datum(plot_eq_energy_data) // 10. Binds data to the line 
    .attr("class", "plotline") // Assign a class for styling
    .attr("d", plot_eq_energy_line)
	.style("stroke", "blue")
	.style("stroke-opacity", 0.3)

teaser_circle_energy_equilbration = teaser_Energy_Plot_Container.append("circle") // Uses the enter().append() method
    //.attr("class", "dot") // Assign a class for styling
    .attr("cx", x_scale_eq_plot(teaser_total_equilibration_steps) )
    .attr("cy", y_scale_eq_plot(plot_eq_energy_data[teaser_total_equilibration_steps].y))
    .attr("r", 4)
    .attr("fill", "blue")
    .attr("opacity", 0.8)

