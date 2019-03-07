const identity_img_energy = "#image_energies_id"

var margin = {right: 100, left: 50}, // position of slider in color field
    width = 700
    height = 600

var svg_imgequil = d3.select(identity_img_energy)
    .append("svg")
    .attr('id', 'main_svg_imag_energy')
    .attr('class','figures')
    .attr("width", width)
    .attr("height", height);

var slider_img = svg_imgequil.append("g") // slider for epoch
    .attr("class", "slider")
    .attr("transform", "translate(" + 20 + "," + 20 + ")");
    // This defines slider position

var img_width = 20 // This is the size of the image in the svg
    img_height = 20
    img_margin = 10

var compressed_size = 10,
    canvas_width = 10,
    canvas_height = 20,
    neuron_margin_x = 28,
    neuron_radius = 8;

var distance_hidden = 230 // how far are hidden and visible appart

// Random initial positions
var img_nr = [];
number_of_images = 100
x_margin_left = 200
x_margin_right = 20
y_margins = 20
final_y = 550

for (var i = 1; i <= number_of_images; i++) {
   img_nr.push([i, x_margin_left+Math.floor((width-x_margin_left-x_margin_right)*Math.random()), Math.floor(y_margins + Math.random()*(height-y_margins))]);
} 

// ADD A SINGLE IMAGE
var main_image_var = img_nr[0][0] // define variable globaly   

main_image = svg_imgequil.append('image')
    .attr('xlink:href', '/figures/selected_MNIST/image_'+main_image_var+'.jpg')
    .attr("x", 50)
    .attr("y", 180)
    .attr("width", 128)
    .attr("height", 128)

        
// ADD MANY IMAGES    
images = svg_imgequil.selectAll()
    .data(img_nr)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return '/figures/selected_MNIST/image_'+d[0]+'.jpg'})
//     .attr('class', 'mnist_images')
    .attr("x", function(d){return d[1]})
    .attr("y", function(d){return d[2]}) 
    .attr("width", img_width)
    .attr("height", img_height)
    .attr('id', function(d){return 'image' + d[0]})
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})  
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})  
    .on("click", function(d){main_image_var = d[0],
                            main_image.attr('xlink:href',                                '/figures/selected_MNIST/image_'+ main_image_var+'.jpg')});


// function to add paths to image
var addpath = function(image, end_y, index){
    var start_x = image.attr('x')
    var start_y = image.attr('y')
    var data = d3.range(11).map(function(){return Math.random()*1}) // defines amount of 'wiggling in x direction'
    var x = d3.scaleLinear().domain([0, 10]).range([start_x, 700]);
    var y = d3.scaleLinear().domain([0, 10]).range([start_y, end_y]);
//     console.log(y)
    var line = d3.line()
          .x(function(d,i) {if (i != 0){return x(d)}
                            else{return x(i)}}    )
          .y(function(d,i) {return y(i);})
          .curve(d3.curveMonotoneY)
    var path =   svg_imgequil.append("path")
                    .attr("d", line(data)) 
                    .attr('id', 'path'+ index)
                    .attr("fill", "none")
                    .attr("stroke-width", 3)
                    .attr("stroke", "rgb(0,0,0,0.3)")
                    .attr('visibility', 'hidden')                                        
}

// add path to each image
for (var i = 1; i <= number_of_images; i++) {
   selected_image = d3.select('#image'+i)
   addpath(selected_image, final_y, i)
   pathtest = document.getElementById('path'+ i)
} 

// function to change the positions of the images
var change_image_pos = function(index, percentage){
    pathtest = document.getElementById('path'+index)
    pathLength = Math.floor( pathtest.getTotalLength() )
    start = pathtest.getPointAtLength(0).y
    end = pathtest.getPointAtLength(100).y
//     console.log(start, end)
    prcnt = (percentage*pathLength) / 100;
//     if (end <= start){prcnt = 100 - (prcnt)}
    pt = pathtest.getPointAtLength(prcnt);
      pt.x = Math.round(pt.x);
      pt.y = Math.round(pt.y);
    d3.select('#image'+index)
                    .attr('x', pt.x)
                    .attr('y', pt.y)   
}
   
// Slider Appending
// -------------------------------------------------
var slider_length = 200
var slider_x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, slider_length])
    .clamp(true);  

slider_img.append("line")
    .attr("class", "track")
    .attr("x1", slider_x.range()[0])
    .attr("x2", slider_x.range()[1]) 

    // This defines from where to where the slider goes
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); }) 
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider_img.interrupt(); }) // this is the function that makes the slider movable
        .on("start drag", function() { argument = slider_x.invert(d3.event.x)
                                       slider_fct_image_energies(argument);
}));

slider_img.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")") // position of ticks
  .selectAll("text")
  .data(slider_x.ticks(4))
  .enter().append("text")
    .attr("x", slider_x)
    .attr("text-anchor", "middle")
    .text(function(d) { return d ; });

// Here we can change the style of the handle
var handle_img = slider_img.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

// Slider Function
// -------------------------------------------------
function slider_fct_image_energies(h) {
  handle_img.attr("cx", slider_x(h))
//   console.log(slider_x(h))
  for (var i = 1; i <= number_of_images; i++) {
  change_image_pos(i, slider_x(h)/slider_length*100);}
}


