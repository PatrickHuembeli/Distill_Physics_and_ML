const identity_img_equil = "#image_equilibration_id"

var margin = {right: 50, left: 50}, // position of slider in color field
    width = 700
    height = 600

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
    neuron_margin_x = 10,
    neuron_radius = 8;

var distance_hidden = 230 // how far are hidden and visible appart

var which_number_index = 0 // defines what number is highlighted (0,1 or 9))
var which_equilibration_step = 1 // how many equil steps have been done.

// This is all for the NN canvas 
// ---------------------------------------------
// add foreign object to svg
// https://gist.github.com/mbostock/1424037
//var foreignObject = svg_imgequil.append("foreignObject")
//    .attr("x", 500)
//    .attr("y", 500)
//    .attr("width", canvas_width)
//    .attr("height", canvas_height);
//
//// add embedded body to foreign object
//var foBody = foreignObject.append("xhtml:body")
//    .style("margin", "0px")
//    .style("padding", "0px")
//    .style("background-color", "none")
//    .style("width", '10' + "px")
//    .style("height", '10' + "px")
//    .style("border", "1px solid lightgray");
//
//var canvas = foBody.append("canvas")
//    .attr("x", 0)
//    .attr("y", 0)
//    .attr("width", canvas_width)
//    .attr("height", canvas_height)
// ----------------------------------------------------

img_nr = [0,1,2,3,4,6]
number_of_images = [0,1,2] // So far we onl have zero, one, nine

// ADD A SINGLE IMAGE
var main_image_var = img_nr[0] // define variable globaly   
var folder_path = '/figures/images_for_equilibration/'
var folder_nr = ['zero/', 'one/', 'nine/']
var images_visible = ['damaged_zeros_visible_','damaged_ones_visible_','damaged_nines_visible_']
var images_hidden = ['resized_damaged_zeros_hidden_','resized_damaged_ones_hidden_','resized_damaged_nines_hidden_']
var image_nr = [0,1,2,3,4,5,6,7,8]

main_image = svg_imgequil.append('image')
    .attr('id', 'main_img_big_id')
    .attr('xlink:href', folder_path+folder_nr[0] + images_visible[0] +0+'.jpg')
    .attr("x", 300)
    .attr("y", 20)
    .attr("width", main_img_width)
    .attr("height", main_img_height)
    
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


const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === 0);
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

//function getwholeImage(url) {
//  var img = new Image();
//  img.src = url;
//  var canvas = document.createElement('canvas');
//  canvas.width = 10
//  canvas.height = 10
//  var context = canvas.getContext('2d');
//  context.drawImage(img, 0, 0);
//  imgData = context.getImageData(0, 0, canvas.width, canvas.height)
//  data_image_full = context.getImageData(0, 0, canvas.width, canvas.height).data
//  data_image_one_channel = every_nth(data_image_full, 4)
//  return binarizeArray(data_image_one_channel, 10)}
//
//
//console.log(getwholeImage(path_for_pixel, 0,0))
//data_reduced_img = getwholeImage(path_for_pixel)
// ADD MANY IMAGES   

images = svg_imgequil.selectAll()
    .data(number_of_images)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return folder_path +folder_nr[d]+images_visible[d] +0+'.jpg'})
    .attr("x", function(d, i){return img_width*i + i*img_margin})
    .attr("y", 20) 
    .attr("width", img_width)
    .attr("height", img_height)
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})  
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})  
    .on("click", function(d){main_image_var = d,
		path_vis = folder_path +folder_nr[d]+images_visible[d]+0+'.jpg',
	        console.log(path_vis),    
                d3.select('#main_img_big_id').attr('xlink:href', path_vis),
                d3.select('#compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+'resized_'+images_visible[d]+0+'.jpg')
                d3.select('#hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[d]+images_hidden[d]+0+'.jpg')
	        which_number_index = d
	        which_equilibration_step = 1
                initialize_NN()
    		});



var hidden_container = svg_imgequil.append("svg")
    .attr("x", 230)
    .attr("y", 200)
    .attr("width", 500)
    .attr("height", 500)
    .attr('id','HiddenContainer'); 
    
var NN_container = svg_imgequil.append("svg")
    .attr("x", 0)
    .attr("y", 200)
    .attr("width", 500)
    .attr("height", 800)
    .attr('id','NNContainer'); 

// Transform compressed image to neural network
// -----------------------------------------------------------------------------
// Define global variables
//var img, context, imgData, raw_data1, raw_data
var colors = ['white', 'black'];
var hidden_colors = ['blue', 'red']; 
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
  data_image_one_channel = every_nth(data_image_full, 4)
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
	console.log('test')
        d3.select('#main_img_big_id').attr('xlink:href', folder_path +folder_nr[which_number_index]+images_visible[which_number_index]+which_equilibration_step+'.jpg')
        d3.select('#compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+'resized_'+images_visible[which_number_index]+which_equilibration_step+'.jpg')
        d3.select('#hidden_compressed_img_id').attr('xlink:href',folder_path +folder_nr[which_number_index]+images_hidden[which_number_index]+which_equilibration_step+'.jpg')
	if (which_equilibration_step < 8){
	which_equilibration_step += 1}
	console.log(which_equilibration_step)
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
	    .duration(2000) 
            .attr('stroke', 'black')
	    .attr('opacity', '0.4')
	    .transition()
            .duration(2000)
            .attr('stroke', 'black')
	    .attr('opacity', '0.1')
        d3.selectAll(".weightline2")
            //.data(points)
	    .transition()
	    .duration(2000) 
            .attr('stroke', 'black')
	    .attr('opacity', '0.4')
	    .transition()
            .duration(2000)
            .attr('stroke', 'black')
	    .attr('opacity', '0.1')

	d3.select("#NNContainer").selectAll("circle")
            .data(points)
	    .transition()
	    .duration(2000)
            .style("fill", function(d) { return colors[d[2]] });
        
        d3.select("#HiddenContainer").selectAll("circle")
	.data(hidden_points)   
        .transition()
        .duration(2000)
        .style("fill", function(d) { return hidden_colors[d[2]]}) 
    }
    else{ // This is for the first run
   
   // Add lines for connection
    d3.select("#NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("line")
	    .attr("class", "weightline1")
            .attr('x1', function(d){return (10 +  neuron_margin_x*points[0][0] - 5*points[0][0] )})
            .attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (10+neuron_margin_x*points[0][1]+ 5*points[0][0] )})
            .attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', 'black')
            .attr('opacity', '0.1')
    // Lines for lower nodes
    d3.select("#NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("line")
	    .attr("class", "weightline2")
            .attr('x1', function(d){return (10 +  neuron_margin_x*points[90][0] - 5*points[90][0] )})
            .attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (10+neuron_margin_x*points[90][1]+ 5*points[90][0] )})
            .attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', 'black')
            .attr('opacity', '0.1')
    // Add visible nodes
   d3.select("#NNContainer").selectAll()
        .data(points)
        .enter()
        .append("circle")
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
        .attr("class", "hidden_nodes")
        .style("fill", function(d) { return hidden_colors[d[2]]}) 
        .attr("transform", function(d) { return "translate(" +(10 +  neuron_margin_x*d[0]- 5*d[0] )+ " " + (10+neuron_margin_x*d[1]+ 5*d[0] )+ ")"; })
        .attr("r", neuron_radius)  
        .attr("opacity", 0.5) 
        
        }
}

async function initialize_NN() {

    img = document.getElementById("compressed_img_id")
    try {
    update_drawing();}
    catch {return 'error'} // Wait for short time to load img
}

initialize_NN()



