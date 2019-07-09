const identity_img_energy = "#image_energies_id"

var margin = {right: 100, left: 50}, // position of slider in color field
    width = 430
    height = 450

var svg_imgequil = d3.select(identity_img_energy)
    .append("svg")
    .attr('id', 'main_svg_imag_energy')
    .attr('class','figures')
    .attr("width", width)
    .attr("height", height);

var img_width = 20 // This is the size of the image in the svg
    img_height = 20
    img_margin = 10

var distance_hidden = 230 // how far are hidden and visible appart

// Random initial positions
var img_nr = [];
number_of_images = 42
modulo_of_images = 6 //How many copies with noise are there of each image
x_margin_left = 100
x_margin_right = 20
y_margins = 20
final_y = 400

for (var i = 0; i < number_of_images; i++) {
   noise_level = i%modulo_of_images
   x_init = x_margin_left+Math.floor((width-x_margin_left-x_margin_right)*Math.random())
   y_init = Math.floor(y_margins + Math.random()*(height-2*y_margins))
   y_end = height-y_margins - Math.floor((height-2*y_margins)/6*noise_level+Math.random()*30)	
   img_nr.push([i,x_init,y_init,y_end ]);
}


// ADD A SINGLE IMAGE
var main_image_var = img_nr[0][0] // define variable globaly   

main_image = svg_imgequil.append('image')
    .attr('xlink:href', '/figures/Images_for_energy_vs_epoch/energy_image_'+main_image_var+'.jpg')
    .attr("x", 20)
    .attr("y", 20)
    .attr("width", 128)
    .attr("height", 128)

        
// ADD MANY IMAGES    
images = svg_imgequil.selectAll()
    .data(img_nr)
    .enter()
    .append("image")
    .attr('xlink:href', function(d){return '/figures/Images_for_energy_vs_epoch/energy_image_'+d[0]+'.jpg'})
//     .attr('class', 'mnist_images')
    .attr("x", function(d){return d[1]})
    .attr("y", function(d){return d[2]})
    .attr("ende", function(d){return d[3]})
    .attr("width", img_width)
    .attr("height", img_height)
    .attr('id', function(d){return 'image' + d[0]})
    .style("opacity", 0.5)
    .on("mouseover",  function(){d3.select(this)
                                    .style("opacity", 1.0)})  
    .on("mouseout", function() {d3.select(this)
                                    .style("opacity", 0.5)})  
    .on("click", function(d){main_image_var = d[0],
                            main_image.attr('xlink:href', '/figures/Images_for_energy_vs_epoch/energy_image_'+ main_image_var+'.jpg')});


// function to add paths to image
function addpath(image,  index){
    var start_x = image.attr('x')
    var start_y = image.attr('y')
    var end_y = image.attr("ende")
	console.log(end_y)
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
for (var i = 0; i < number_of_images; i++) {
   selected_image = d3.select('#image'+i)
   addpath(selected_image, i)
  // pathtest = document.getElementById('path'+ i)
} 

all_paths = []
number_of_steps = 101 // This is defined in slider fct in article.html
for (j=0;j<number_of_images;j++){
   single_path = []	
   for (i=0;i<number_of_steps;i++){
    pathtest = document.getElementById('path'+j)
    pathLength = Math.floor( pathtest.getTotalLength() )
    start = pathtest.getPointAtLength(0).y
    end = pathtest.getPointAtLength(100).y
    prcnt = (i*pathLength) / 100;
    pt = pathtest.getPointAtLength(prcnt);
      pt.x = Math.round(pt.x);
      pt.y = Math.round(pt.y);
   single_path.push([pt.x,pt.y])	   
   }
   all_paths.push(single_path)	
}
// function to change the positions of the images
//function change_image_pos(index, percentage){
//    pathtest = document.getElementById('path'+index)
//    pathLength = Math.floor( pathtest.getTotalLength() )
//    start = pathtest.getPointAtLength(0).y
//    end = pathtest.getPointAtLength(100).y
////     console.log(start, end)
//    prcnt = (percentage*pathLength) / 100;
////     if (end <= start){prcnt = 100 - (prcnt)}
//    pt = pathtest.getPointAtLength(prcnt);
//      pt.x = Math.round(pt.x);
//      pt.y = Math.round(pt.y);
//    d3.select('#image'+index).transition().delay(100)
//                    .attr('x', pt.x)
//                    .attr('y', pt.y)   
//}

// Slider Function
// -------------------------------------------------
function slider_fct_image_energies(h) {
  for (var i = 0; i < number_of_images; i++) {
  //change_image_pos(i, h);
   xx = all_paths[i][h][0]
   yy = all_paths[i][h][1]

    d3.select('#image'+i)
                    .attr('x', xx)
                    .attr('y', yy)   
  }
}


