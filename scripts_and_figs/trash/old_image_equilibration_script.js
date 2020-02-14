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

var img_width = 128 // This is the size of the image in the svg
    img_height = 128
    img_margin = 10

var compressed_size = 10,
    canvas_width = 10,
    canvas_height = 20,
    neuron_margin_x = 28,
    neuron_radius = 8;

var distance_hidden = 230 // how far are hidden and visible appart
// This is all for the NN canvas 
// ---------------------------------------------
// add foreign object to svg
// https://gist.github.com/mbostock/1424037
var foreignObject = svg_imgequil.append("foreignObject")
    .attr("x", 500)
    .attr("y", 500)
    .attr("width", canvas_width)
    .attr("height", canvas_height);

// add embedded body to foreign object
var foBody = foreignObject.append("xhtml:body")
    .style("margin", "0px")
    .style("padding", "0px")
    .style("background-color", "none")
    .style("width", '10' + "px")
    .style("height", '10' + "px")
    .style("border", "1px solid lightgray");

var canvas = foBody.append("canvas")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", canvas_width)
    .attr("height", canvas_height)
// ----------------------------------------------------

img_nr = [0,1,2,3,4,6]
// img_nr = [4,6,7,8,9,10]    

// ADD A SINGLE IMAGE
var main_image_var = img_nr[0] // define variable globaly   

main_image = svg_imgequil.append('image')
    .attr('xlink:href', '/figures/selected_MNIST/image_'+main_image_var+'.jpg')
    .attr("x", 50)
    .attr("y", 180)
    .attr("width", img_width)
    .attr("height", img_height)
    
compressed_image = svg_imgequil.append('image')
    .attr('id', 'compressed_img_id')
    .attr('xlink:href', '/figures/selected_MNIST/image_'+main_image_var+'_resized.jpg')
    .attr("x", 50)
    .attr("y", 350)
    .attr("width", img_width)
    .attr("height", img_height)

        
// ADD MANY IMAGES    
images = svg_imgequil.selectAll()
    .data(img_nr)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return '/figures/selected_MNIST/image_'+d+'.jpg'})
//     .attr('class', 'mnist_images')
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
                main_image.attr('xlink:href', '/figures/selected_MNIST/image_'+main_image_var+'.jpg'),
                compressed_image.attr('xlink:href', '/figures/selected_MNIST/image_'+main_image_var+'_resized.jpg'),
                initialize_NN()});

var hidden_container = svg_imgequil.append("svg")
    .attr("x", 450)
    .attr("y", 200)
    .attr("width", 500)
    .attr("height", 500)
    .attr('id','HiddenContainer'); 
    
var NN_container = svg_imgequil.append("svg")
    .attr("x", 220)
    .attr("y", 200)
    .attr("width", 500)
    .attr("height", 800)
    .attr('id','NNContainer'); 

// Transform compressed image to neural network
// -----------------------------------------------------------------------------
// Define global variables
var img, context, imgData, raw_data1, raw_data
var colors = ['white', 'black'];
var hidden_colors = ['blue', 'red']; 
var initialize_flag = false
context = canvas.node().getContext("2d");



async function update_drawing() {
    await new Promise(r => setTimeout(r, 200)); // Wait a short time until data is really loaded.
    
    context.drawImage(img, 0, 0);
    imgData = context.getImageData(0, 0, compressed_size, compressed_size);
    raw_data = imgData.data
    imgData = context.getImageData(0, 0, compressed_size, compressed_size);
    raw_data = imgData.data
    var points = [];

    for (var s = 0; s < compressed_size*compressed_size; s++) {
        var i = s * 4; // because there is always r,g,b,a for each pixel
        var p = Math.floor(i / 4); // pixel index
        var x = p % compressed_size, // x index
            y = Math.floor(p / compressed_size), // y index
            c = Math.round(raw_data[i]/255);
        points.push([x, y, c]);
    };
    
   
        
    if (initialize_flag){
        d3.select("#NNContainer").selectAll("circle")
            .data(points)
            .style("fill", function(d) { return colors[d[2]] 
                                    console.log(d)});
        
        d3.select("#HiddenContainer").selectAll("circle")
        .transition()
        .duration(100)
        .style("fill", function(d) { return hidden_colors[Math.round(Math.random())]}) 
    }
    else{ // This is for the first run
    
    d3.select("#NNContainer").selectAll()
            .data(points)
            .enter()    
            .append("line")
            .attr('x1', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] )})
            .attr('x2', function(d){return (10 +  neuron_margin_x*d[0] - 5*d[0] + distance_hidden)})
            .attr('y1', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('y2', function(d){return (10+neuron_margin_x*d[1]+ 5*d[0] )})
            .attr('stroke', 'black')
            .attr('opacity', '0.3')
    
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
    
       
    d3.select("#HiddenContainer").selectAll()
        .data(points)
        .enter()
        .append("circle")        
        .attr("class", "hidden_nodes")
        .style("fill", function(d) { return hidden_colors[Math.round(Math.random())]}) 
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



