const identity_img_energy = "#image_energies_id"

var margin = {right: 100, left: 50}, // position of slider in color field
    height = 450

var svg_imgequil = d3.select(identity_img_energy)
    .append("svg")
    .attr('id', 'main_svg_imag_energy')
    .attr('class','figures')
    .attr("width", "100%")
    .attr("height", height);

width_energies_img = document.getElementById("image_energies").clientWidth

var img_width = 20 // This is the size of the image in the svg
    img_height = 20
    img_margin = 10

var distance_hidden = 230 // how far are hidden and visible appart

// Random initial positions
var img_nr = [];
UL_FIG_number_of_images = 42
modulo_of_images = 6 //How many copies with noise are there of each image
x_margin_left = 0
x_margin_right = 20
y_margins = 20
final_y = 400

for (var i = 0; i < UL_FIG_number_of_images; i++) {
   noise_level = i%modulo_of_images
   x_init = x_margin_left+Math.floor((width_energies_img-x_margin_left-x_margin_right)*Math.random())
   y_init = Math.floor(y_margins + Math.random()*(height-2*y_margins))
   y_end = height-y_margins - Math.floor((height-2*y_margins)/6*noise_level+Math.random()*30)	
   img_nr.push([i,x_init,y_init,y_end ]);
}


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
    var data = d3.range(11).map(function(){return Math.random()*1}) // defines amount of 'wiggling in x direction'
    var x = d3.scaleLinear().domain([0, 10]).range([start_x, width_energies_img]);
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
for (var i = 0; i < UL_FIG_number_of_images; i++) {
   selected_image = d3.select('#image'+i)
   addpath(selected_image, i)
  // pathtest = document.getElementById('path'+ i)
} 

all_paths = []
UL_FIG_number_of_steps = 101 // This is defined in slider fct in article.html
for (j=0;j<UL_FIG_number_of_images;j++){
   single_path = []	
   for (i=0;i<UL_FIG_number_of_steps;i++){
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
// Slider Function
// -------------------------------------------------
function unlearning_fct_image_energies(h) {
  for (var i = 0; i < UL_FIG_number_of_images; i++) {
  //change_image_pos(i, h);
   xx = all_paths[i][h][0]
   yy = all_paths[i][h][1]
    d3.select('#image'+i).transition().duration(4000)
                    .attr('x', xx)
                    .attr('y', yy)   
  }
}
function learning_fct_image_energies(h) {
  good_img_list = [0,6,12,18,24,30,36]	
  for (var i=0; i< good_img_list.length; i++) {
  //change_image_pos(i, h);
	 idx = good_img_list[i]
	 console.log(idx)
   xx = all_paths[idx][h][0]
   yy = all_paths[idx][h][1]
    d3.select('#image'+idx).transition().duration(4000)
                    .attr('x', xx)
                    .attr('y', yy)   
  }
}
function move_images_learning(){
	learning_fct_image_energies(UL_FIG_number_of_steps-1)
}

